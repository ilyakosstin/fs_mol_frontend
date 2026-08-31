namespace $.$$ {
    export class $fs_oauth2_status extends $.$fs_oauth2_status {

        @ $mol_mem
        token_data() : $TokenData | null {
            return $mol_wire_sync($tox_oauth2_get_current_token_data)()
        }

        @ $mol_mem
        user_data() : string {
            return JSON.stringify($mol_wire_sync($tox_oauth2_get_user_data)())
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