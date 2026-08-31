namespace $.$$ {

    export class $fs_home extends $.$fs_home {

        file_directories_loading_error() : string {
            return ""
        }

        @ $mol_mem
        file_directories() {
            try {
                const directories = $mol_wire_sync($tox_fs_get_directories)().concat($tox_fs_mock_directories())
                return directories.map((dto, i) => new this.$.$fs_home_directory(dto, i))
            } catch(e) {
                this.file_directories_loading_error = () => `Could not load file directories! Error: ${e}`
                return []
            }
        }

        @ $mol_mem
        AuthNotLoggedIn() {
            const panel = new $mol_list()
            const label = new $mol_text()
            const loginLink = new $mol_link()

            loginLink.title = () => "Log in"
            loginLink.uri = () => "/fs/oauth2/init"

            label.text = () => "Not logged in"

            panel.rows = () => [
                label,
                loginLink
            ]

            return panel
        }

        @ $mol_mem
        // Q: why it needs "?" to be able to cache that?
        AuthLoggedIn(data?: $OidData) {
            const panel = new $mol_list()
            const label = new $mol_text()
            const logoutLink = new $mol_link()

            logoutLink.title = () => "Log out"
            logoutLink.uri = () => "/fs/oauth2/logout"

            label.text = () => `Logged in as userid=${data?.userid}`

            panel.rows = () => [
                label,
                logoutLink
            ]

            return panel
        }

        @ $mol_mem
        AuthPanel() {
            const data = $mol_wire_sync($tox_oauth2_get_user_data)()

            if (data == null) {
                return this.AuthNotLoggedIn()
            }

            return this.AuthLoggedIn(data)
        }

    }

}