namespace $.$$ {
    export class $bog_tox_fs_oauth2_status extends $.$bog_tox_fs_oauth2_status {

        session() { return this.$.$mol_one.$bog_tox_fs_tox_oauth2 }

        access_token() {
            return this.session().access_token() ?? '<null>'
        }

        refresh_token() {
            return this.session().tokens()?.refresh_token ?? '<null>'
        }

        user_data() {
            return JSON.stringify( this.session().user() )
        }

    }
}
