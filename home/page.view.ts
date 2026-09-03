namespace $.$$ {

    export class $bog_tox_fs_home extends $.$bog_tox_fs_home {

        session() { return this.$.$mol_one.$bog_tox_fs_tox_oauth2 }
        files() { return this.$.$mol_one.$bog_tox_fs_tox_fs }

        auth_label() {
            const user = this.session().user()
            return user ? `Logged in as userid=${ user.userid }` : 'Not logged in'
        }

        auth_rows() {
            return [
                this.Auth_label(),
                this.session().logged() ? this.Logout() : this.Login(),
            ]
        }

        @ $mol_action
        login() {
            this.session().login()
        }

        @ $mol_action
        logout( next?: any ) {
            this.session().logout()
        }

        @ $mol_mem
        directories_data() {
            return this.files().mock_directories()
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
