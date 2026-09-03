namespace $.$$ {
    export class $bog_tox_fs_oauth2_init extends $.$bog_tox_fs_oauth2_init {

        @ $mol_mem
        current_auth_data(): string {
            return JSON.stringify( $bog_tox_fs_tox_oauth2_user_data() )
        }

        @ $mol_action
        proceed() {
            const url = this.$.$bog_tox_fs_tox_oauth2_authorization_uri()
            this.$.$mol_dom_context.location.href = url
        }

    }
}
