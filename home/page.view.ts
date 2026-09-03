namespace $.$$ {

    export class $bog_tox_fs_home extends $.$bog_tox_fs_home {

        @ $mol_mem
        user_data() {
            return $bog_tox_fs_tox_oauth2_user_data()
        }

        @ $mol_mem
        file_directories() {
             const dtos = $bog_tox_fs_tox_fs_mock_directories()
             // $mol_list.rows ждёт компоненты, а не DTO
             return dtos.map( ( dto, i ) => new this.$.$bog_tox_fs_home_directory( dto, i ) )
        }

        @ $mol_action
        login() {
            this.$.$mol_dom_context.location.href = this.$.$bog_tox_fs_tox_oauth2_authorization_uri()
        }

        @ $mol_action
        logout() {
            this.$.$bog_tox_fs_tox_oauth2_stored( null )
        }

        @ $mol_mem
        AuthNotLoggedIn() {
            const panel = new $mol_list()
            const label = new $mol_text()
            const loginButton = new $mol_button_minor()

            label.text = () => "Not logged in"

            loginButton.title = () => "Log in"
            loginButton.click = () => this.login()

            panel.rows = () => [ label, loginButton ]

            return panel
        }

        /**
         * Без аргумента: @ $mol_mem — это ячейка, её единственный
         * параметр означает "записываемое значение", а не вход.
         * С AuthLoggedIn(data) закешировался бы первый вызов,
         * а последующие data игнорировались. Данные читаем внутри.
         */
        @ $mol_mem
        AuthLoggedIn() {
            const panel = new $mol_list()
            const label = new $mol_text()
            const logoutButton = new $mol_button_minor()

            label.text = () => `Logged in as userid=${ this.user_data()?.userid }`

            logoutButton.title = () => "Log out"
            logoutButton.click = () => this.logout()

            panel.rows = () => [ label, logoutButton ]

            return panel
        }

        @ $mol_mem
        AuthPanel() {
            return this.user_data() == null
                ? this.AuthNotLoggedIn()
                : this.AuthLoggedIn()
        }

    }

}
