namespace $ {

	/** Ответ token endpoint. */
	export type $bog_tox_fs_tox_oauth2_tokens = {
		access_token: string
		refresh_token: string
		token_type: string
		scope: string
		id_token: string
	}

	/** Разобранная полезная нагрузка JWT. */
	type Payload = {
		exp?: number
		userid?: string
	}

	/** Отказы, после которых сессию не восстановить — только разлогинить. */
	const DEAD_SESSION: readonly string[] = [
		'invalid_grant', 'invalid_token', 'unauthorized_client',
	]

	/** Параметры, которые в наш адрес добавляет провайдер. */
	const CALLBACK_PARAMS = [
		'code', 'state', 'session_state', 'iss',
		'error', 'error_description', 'error_uri',
	] as const

	export class $bog_tox_fs_tox_oauth2 extends $mol_object2 {

		// --- конфигурация: переопределяется через $. ---

		client_id() { return 'fs-frontend' }

		auth_base_uri() { return this.$.AUTH_BASE_URI() }

		scopes() { return [ 'openid', 'fs.read', 'fs.write' ] as readonly string[] }

		/** Запас на дорогу до сервера, мс. */
		min_validity() { return 5_000 }

		store_key() { return `${ this.client_id() }_oauth2` }

		endpoint( key: 'auth' | 'token' ) {
			return this.auth_base_uri() + ( key === 'auth' ? '/oauth2/authorize' : '/oauth2/token' )
		}

		// --- адрес приложения ---

		/**
		 * Текущий адрес, очищенный от параметров провайдера, — он же
		 * и redirect_uri. Не зашитая строка: MAM собирает деплой в "-/",
		 * который на проде станет корнем, и путь поехал бы. Фрагмент
		 * срезаем: его в redirect_uri запрещает RFC 6749 3.1.2, а $mol
		 * держит в хэше роутинг, так что он там бы и оказался.
		 */
		clean_uri() {
			const url = new URL( this.$.$mol_dom_context.location.href )
			for( const key of CALLBACK_PARAMS ) url.searchParams.delete( key )
			url.hash = ''
			return url.toString().replace( /\?$/, '' )
		}

		redirect_uri() { return this.clean_uri() }

		/** Код, который провайдер вернул в query. Фрагмент тут не годится — см. clean_uri. */
		@ $mol_mem
		code() {
			const search = this.$.$mol_dom_context.location.search
			return new URLSearchParams( search ).get( 'code' ) ?? ''
		}

		// --- хранилище ---

		@ $mol_mem
		stored( next?: $bog_tox_fs_tox_oauth2_tokens | null ) {
			return this.$.$mol_state_local.value< $bog_tox_fs_tox_oauth2_tokens >( this.store_key(), next )
		}

		// --- разбор токена ---

		payload( token: string ): Payload | null {
			try {
				return this.$.$mol_jwt_decode( token ).payload as Payload
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				$mol_fail_log( error )
				return null
			}
		}

		/**
		 * Срок жизни берём из claim exp самого токена, а не из expires_in:
		 * не зависит ни от расхождения часов, ни от того, когда мы успели
		 * записать ответ в хранилище.
		 */
		expired( token: string ) {
			const exp = this.payload( token )?.exp
			if( !exp ) return true
			return exp * 1000 - Date.now() - this.min_validity() <= 0
		}

		// --- запросы ---

		/** Тело ответа, если оно вообще разбирается в JSON. */
		parse( response: $mol_fetch_response ) {
			try {
				return response.json() as Record< string, string > | null
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return null
			}
		}

		@ $mol_action
		fetch_tokens( fd: URLSearchParams ) {
			fd.set( 'client_id', this.client_id() )

			const response = this.$.$mol_fetch.response( this.endpoint( 'token' ), {
				method: 'POST',
				body: fd,
			} )

			const body = this.parse( response )

			if( response.status() === 'success' ) {
				return body as unknown as $bog_tox_fs_tox_oauth2_tokens
			}

			throw new Error( body?.error ?? response.message(), {
				cause: body ?? response,
			} )
		}

		@ $mol_action
		fetch_by_refresh( refresh_token: string ) {
			return this.fetch_tokens( new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token,
			}) )
		}

		@ $mol_action
		fetch_by_code( code: string ) {
			return this.fetch_tokens( new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: this.redirect_uri(),
			}) )
		}

		// --- состояние сессии ---

		/** Актуальные токены: истёкший access_token молча обновляет по refresh_token. */
		@ $mol_mem
		tokens(): $bog_tox_fs_tox_oauth2_tokens | null {
			const stored = this.stored()
			if( !stored ) return null

			if( !this.expired( stored.access_token ) ) return stored

			try {
				return this.stored( this.fetch_by_refresh( stored.refresh_token ) )
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )

				const code = error instanceof Error ? error.message : ''

				if( !DEAD_SESSION.includes( code ) ) $mol_fail_hidden( error )

				$mol_fail_log( error )
				this.stored( null )
				return null
			}
		}

		access_token() { return this.tokens()?.access_token ?? null }

		user() {
			const tokens = this.tokens()
			return tokens && this.payload( tokens.id_token )
		}

		logged() { return Boolean( this.tokens() ) }

		auth_header() {
			const token = this.access_token()
			return token ? { Authorization: `Bearer ${ token }` } : null
		}

		// --- флоу ---

		login_uri() {
			const url = new URL( this.endpoint( 'auth' ) )
			url.search = new URLSearchParams({
				redirect_uri: this.redirect_uri(),
				scope: this.scopes().join( ' ' ),
				response_type: 'code',
				client_id: this.client_id(),
			}).toString()
			return url.toString()
		}

		@ $mol_action
		login() {
			this.$.$mol_dom_context.location.href = this.login_uri()
		}

		@ $mol_action
		logout() {
			this.stored( null )
		}

		@ $mol_action
		exchange( code: string ) {
			const tokens = this.stored( this.fetch_by_code( code ) )

			// Код одноразовый: убираем его из адреса, иначе перезагрузка
			// попытается обменять его повторно. Через $mol_state_arg.href
			// — это history.replaceState, без перезагрузки страницы.
			this.$.$mol_state_arg.href( this.clean_uri() )

			return tokens
		}

	}

}
