namespace $.$$ {
    export class $bog_tox_fs_oauth2_callback extends $.$bog_tox_fs_oauth2_callback {
    

        async token() {
            const result = await this.$.$bog_tox_fs_tox_oauth2_code_fetch_token(this.code())
            this.$.$bog_tox_fs_tox_oauth2_save_token_fetch_result(result)
            // redirect to home page after a brief indication of success
        }

        @ $mol_mem
        code() : string {
            return new URLSearchParams(window.location.search).get("code") ?? ""
        }

    }
}