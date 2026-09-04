namespace $.$$ {

	/** Инстанс TinyMCE вместе с узлом, в который он смонтирован. */
	type Mount = { editor: any, target: Element }

	/**
	 * WYSIWYG-редактор поверх [TinyMCE](https://www.tiny.cloud/docs/tinymce/latest/).
	 *
	 * Ассеты ставятся из npm (`.npm/package.json`) и попадают в бандл приложения
	 * через `deploy` из `wysiwyg.meta.tree` — ни CDN, ни ключей не требуется.
	 */
	export class $bog_tox_fs_wysiwyg extends $.$bog_tox_fs_wysiwyg {

		/** Путь до задеплоенных ассетов относительно корня приложения. */
		static base_uri() {
			return 'bog/tox/fs/wysiwyg/.npm/-/tinymce'
		}

		/** Глобальный TinyMCE. Скрипт грузится один раз на всё приложение. */
		@ $mol_mem
		static api(): any {

			$mol_wire_solid()

			const base = new URL( this.base_uri(), this.$.$mol_dom_context.document.baseURI ).href
			const api = this.$.$mol_import.script( `${ base }/tinymce.min.js?v=${ $bog_tox_fs_wysiwyg_version }` ).tinymce

			// Автодетект корня спотыкается о query-строку, поэтому задаём явно.
			api.baseURL = base
			api.suffix = '.min'

			return api
		}

		/** Тему редактора держим в одном флаконе с темой приложения. */
		skin() {
			return this.$.$mol_lights() ? 'oxide' : 'oxide-dark'
		}

		content_skin() {
			return this.$.$mol_lights() ? 'default' : 'dark'
		}

		/** Опции инициализации. Переопределяется у наследников. */
		config(): Record< string, any > {
			return {
				license_key: 'gpl',
				base_url: $bog_tox_fs_wysiwyg.base_uri(),
				menubar: this.menubar(),
				plugins: this.extensions().join( ' ' ),
				toolbar: this.toolbar().slice(),
				toolbar_mode: 'wrap',
				height: this.height(),
				placeholder: this.placeholder(),
				skin: this.skin(),
				content_css: this.content_skin(),
				branding: false,
				promotion: false,
				statusbar: true,
				elementpath: true,
				convert_urls: false,
			}
		}

		/**
		 * Поднимает редактор в собственном узле — $mol этот узел не рендерит,
		 * поэтому перерисовка вьюхи ему не мешает.
		 */
		async make( config_json: string ): Promise< Mount > {

			const target = this.$.$mol_dom_context.document.createElement( 'div' )
			this.dom_node().appendChild( target )

			let editor
			try {
				;[ editor ] = await $bog_tox_fs_wysiwyg.api().init({ ... JSON.parse( config_json ), target })
			} catch( error ) {
				target.remove()
				return $mol_fail_hidden( error )
			}

			editor.on( 'input change undo redo', $mol_wire_async( ()=> this.value( editor.getContent() ) ) )

			return { editor, target }
		}

		/**
		 * Ключ — сериализованный конфиг: сменилась тема или тулбар — атом с прежним
		 * ключом остаётся без подписчиков, и $mol зовёт `destructor()` старого редактора.
		 */
		@ $mol_mem_key
		mount( config_json: string ) {

			const { editor, target } = $mol_wire_sync( this ).make( config_json )

			return {
				editor,
				destructor: ()=> {
					editor.remove()
					target.remove()
				},
			}
		}

		editor() {
			return this.mount( JSON.stringify( this.config() ) ).editor
		}

		/** Заливает значение в редактор, когда его меняют снаружи. */
		@ $mol_mem
		content_actual() {
			const editor = this.editor()
			const value = this.value()
			if( editor.getContent() !== value ) editor.setContent( value )
			return value
		}

		/** Детей не рендерим: внутри хозяйничает TinyMCE. */
		override render() {
			this.dom_node_actual()
			this.content_actual()
		}

	}

}
