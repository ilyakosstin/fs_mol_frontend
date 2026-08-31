namespace $.$$ {
    export class $fs_oauth2_init extends $.$fs_oauth2_init {
    

        @ $mol_mem
        current_auth_data(): string {
            const data : $OidData | null = $mol_wire_sync(this.$.$tox_oauth2_get_user_data)()
            return JSON.stringify(data)
        }

        proceed() {
            const url = this.$.$tox_oauth2_get_authorization_uri()
            
            console.log(`Redirecting to ${url}`)

            this.$.$mol_dom_context.location.href = url
        }

    }
}