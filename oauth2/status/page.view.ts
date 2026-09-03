namespace $.$$ {
    export class $bog_tox_fs_oauth2_status extends $.$bog_tox_fs_oauth2_status {

        @ $mol_mem
        token_data() : tox_oauth2_token | null {
            return $bog_tox_fs_tox_oauth2_token_data()
        }

        @ $mol_mem
        user_data() : string {
            return JSON.stringify( $bog_tox_fs_tox_oauth2_user_data() )
        }

        @ $mol_mem
        access_token() : string {
            const data = this.token_data()
            return data == null? "<null>" : data.access_token
        }

        @ $mol_mem
        refresh_token() : string {
            const data = this.token_data()
            return data == null? "<null>" : data.refresh_token
        }

    }
}
