namespace $ {

	export type tox_oauth2_token = {
        access_token: string
        refresh_token: string
        expires_in: number      // секунды
        token_type: string
        scope: string
        id_token: string
    }

    export type token_stored = {
        fetched_at: number
        data: tox_oauth2_token
    }

     export type tox_oauth2_oid = { userid: string }
     const CLIENT_ID = 'fs-frontend'
     const LOOKAHEAD = 5_000
     const STORE = 'oauth2'
     const SCOPES = [ 'openid', 'fs.read', 'fs.write' ]


    /** Параметры, которые в наш URL добавляет провайдер. */
    const CALLBACK_PARAMS = [
        'code', 'state', 'session_state', 'iss',
        'error', 'error_description', 'error_uri',
    ] as const

    /**
     * Текущий адрес, очищенный от параметров провайдера, — он же
     * и redirect_uri. Не зашитая строка: MAM собирает деплой в "-/",
     * который на проде станет корнем, и путь поехал бы. Фрагмент
     * срезаем — его в redirect_uri запрещает RFC 6749 3.1.2, а $mol
     * держит в хэше роутинг, так что он там бы и оказался.
     */
    export function $bog_tox_fs_tox_oauth2_clean_uri() {
        const url = new URL( $mol_dom_context.location.href )
        for( const key of CALLBACK_PARAMS ) url.searchParams.delete( key )
        url.hash = ''
        return url.toString().replace( /\?$/, '' )
    }

    function $bog_tox_fs_tox_oauth2_redirect_uri() {
        return $bog_tox_fs_tox_oauth2_clean_uri()
    }

    export function $bog_tox_fs_tox_oauth2_stored( next?: token_stored | null ) {
             return $mol_state_local.value< token_stored >( STORE, next )
    }

    function $bog_tox_fs_tox_oauth2_fetch( fd: URLSearchParams ) {
             fd.set( 'client_id', CLIENT_ID )

             const data = $mol_fetch.json( AUTH_BASE_URI() + '/oauth2/token', {
                     method: 'POST',
                     body: fd,
             } ) 

             return { fetched_at: Date.now(), data } as token_stored
    }

     export function $bog_tox_fs_tox_oauth2_exchange( code: string ) {
             const fd = new URLSearchParams({
                     grant_type: 'authorization_code',
                     code,
                     redirect_uri: $bog_tox_fs_tox_oauth2_redirect_uri(),
             })
             const stored = $bog_tox_fs_tox_oauth2_fetch( fd )
             $bog_tox_fs_tox_oauth2_stored( stored )

             // Код одноразовый: убираем его из адреса, чтобы перезагрузка
             // не пыталась обменять его повторно. Через $mol_state_arg.href
             // — это history.replaceState, без перезагрузки страницы.
             $mol_state_arg.href( $bog_tox_fs_tox_oauth2_clean_uri() )

             return stored
    }

     export function $bog_tox_fs_tox_oauth2_refresh( refresh_token: string ) {
             const fd = new URLSearchParams({ grant_type: 'refresh_token', refresh_token })
             const stored = $bog_tox_fs_tox_oauth2_fetch( fd )
             $bog_tox_fs_tox_oauth2_stored( stored )
             return stored 
     }

    export function $bog_tox_fs_tox_oauth2_token_data() {
             const stored = $bog_tox_fs_tox_oauth2_stored()
             if( !stored ) return null

             const expires_at = stored.fetched_at + stored.data.expires_in * 1000
             if( Date.now() < expires_at - LOOKAHEAD ) return stored.data

             return $bog_tox_fs_tox_oauth2_refresh( stored.data.refresh_token ).data
    }

    export function $bog_tox_fs_tox_oauth2_user_data() {
             const token = $bog_tox_fs_tox_oauth2_token_data()
             return token && $mol_jwt_decode( token.id_token ).payload
    }

    export function $bog_tox_fs_tox_oauth2_auth_header() {
             const token = $bog_tox_fs_tox_oauth2_token_data()
             return token && { Authorization: `Bearer ${ token.access_token }` }
    }

    export function $bog_tox_fs_tox_oauth2_authorization_uri() {
             const url = new URL( AUTH_BASE_URI() + '/oauth2/authorize' )
             url.search = new URLSearchParams({
                     redirect_uri: $bog_tox_fs_tox_oauth2_redirect_uri(),
                     scope: SCOPES.join(' '),
                     response_type: 'code',
                     client_id: CLIENT_ID,
             }).toString()
             return url.toString()
    }

    export function $bog_tox_fs_tox_oauth2_init_login() {
             $mol_dom_context.location.href = $bog_tox_fs_tox_oauth2_authorization_uri()
    }

}
