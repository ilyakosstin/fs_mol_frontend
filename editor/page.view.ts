namespace $.$$ {

	/** Страница с WYSIWYG-редактором. Черновик переживает перезагрузку. */
	export class $bog_tox_fs_editor extends $.$bog_tox_fs_editor {

		@ $mol_mem
		text( next?: string ): string {
			return this.$.$mol_state_local.value( '$bog_tox_fs_editor.text', next ) ?? ''
		}

	}

}
