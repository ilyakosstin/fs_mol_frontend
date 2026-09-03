namespace $.$$ {

    export class $bog_tox_fs_home_directory extends $.$bog_tox_fs_home_directory {

        data() {
            return this.dto() as $bog_tox_fs_tox_fs_directory
        }

        displayed_name() {
            const data = this.data()
            return data.name ?? data.id
        }

        link_uri() {
            return this.$.$mol_state_arg.link({ directory: this.data().id })
        }

        additional_info() {
            const data = this.data()
            return `(nFiles=${ data.nFiles }, isPublic=${ data.isPublic })`
        }

    }
}
