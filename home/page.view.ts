namespace $.$$ {

    export class $bog_tox_fs_home extends $.$bog_tox_fs_home {

        @ $mol_mem
        user_data() {
            return $bog_tox_fs_tox_oauth2_user_data()
        }

        auth_label() {
            const user = this.user_data()
            return user ? `Logged in as userid=${ user.userid }` : 'Not logged in'
        }

        auth_rows() {
            return [
                this.Auth_label(),
                this.user_data() ? this.Logout() : this.Login(),
            ]
        }

        @ $mol_action
        login( next?: any ) {
            this.$.$mol_dom_context.location.href = this.$.$bog_tox_fs_tox_oauth2_authorization_uri()
        }

        @ $mol_action
        logout( next?: any ) {
            this.$.$bog_tox_fs_tox_oauth2_stored( null )
        }

        @ $mol_mem
        directories_data() {
            return $bog_tox_fs_tox_fs_mock_directories()
        }

        /** Ключ переживает перерисовку — строка не пересоздаётся. */
        @ $mol_mem_key
        Directory( index: number ) {
            const row = new this.$.$bog_tox_fs_home_directory()
            row.dto = () => this.directories_data()[ index ]
            row.index = () => String( index )
            return row
        }

        @ $mol_mem
        file_directories() {
            return this.directories_data().map( ( _, i ) => this.Directory( i ) )
        }

    }

}
