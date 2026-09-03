namespace $ {

	export type $bog_tox_fs_tox_fs_directory = {
		id: string
		ownerId: string
		name: string | null
		isPublic: boolean
		nFiles: number
	}

	export class $bog_tox_fs_tox_fs extends $mol_object2 {


		session() { return this.$.$mol_one.$bog_tox_fs_tox_oauth2 }

		@ $mol_mem
		directories() {
			return this.$.$mol_fetch.json( this.$.FS_BASE_URI() + '/directories', {
				headers: this.session().auth_header() ?? {},
			} ) as $bog_tox_fs_tox_fs_directory[]
		}

		mock_directories(): $bog_tox_fs_tox_fs_directory[] {
			return [
				{ id: 'UUID1', ownerId: 'UUID2', name: 'Lakhta walk', isPublic: true, nFiles: 2 },
				{ id: 'UUID3', ownerId: 'UUID2', name: null, isPublic: true, nFiles: 2 },
			]
		}

	}

}
