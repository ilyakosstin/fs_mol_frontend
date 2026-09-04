namespace $.$$ {

	/** Точка входа: единственный index.html, страницы выбирает роутер. */
	export class $bog_tox_fs_app extends $.$bog_tox_fs_app {

		session() { return this.$.$mol_one.$bog_tox_fs_tox_oauth2 }

		page() {
			return this.$.$mol_state_arg.value( 'page' ) ?? ''
		}

		pages() {
			const page = this.page()
			return [
				this.Home(),
				... this.session().code() ? [ this.Callback() ] : [],
				... page === 'status' ? [ this.Status() ] : [],
				... page === 'local' ? [ this.Local() ] : [],
				... page === 'editor' ? [ this.Editor() ] : [],
			]
		}

	}

}
