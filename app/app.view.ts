namespace $.$$ {

	/** Точка входа: единственный index.html, страницы выбирает роутер. */
	export class $bog_tox_fs_app extends $.$bog_tox_fs_app {

		/**
		 * OAuth2 отдаёт код в query, а не в хэше: RFC 6749 3.1.2
		 * запрещает в redirect_uri фрагмент, но не query.
		 * Поэтому $mol_state_arg, живущий в хэше, тут не подходит.
		 */
		@ $mol_mem
		code() {
			const search = this.$.$mol_dom_context.location.search
			return new URLSearchParams( search ).get( 'code' ) ?? ''
		}

		page() {
			return this.$.$mol_state_arg.value( 'page' ) ?? ''
		}

		pages() {
			const page = this.page()
			return [
				this.Home(),
				... this.code() ? [ this.Callback() ] : [],
				... page === 'status' ? [ this.Status() ] : [],
				... page === 'local' ? [ this.Local() ] : [],
			]
		}

	}

}
