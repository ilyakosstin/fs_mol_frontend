namespace $.$$ {
    export class $bog_tox_fs_oauth2_callback extends $.$bog_tox_fs_oauth2_callback {

        session() { return this.$.$mol_one.$bog_tox_fs_tox_oauth2 }

        code() { return this.session().code() }

        /**
         * @ $mol_action, а не async: обработчик синхронный, подвисание
         * идёт через throw-promise фибры, а async его проглатывает.
         */
        @ $mol_action
        token() {
            this.session().exchange( this.code() )
        }

    }
}
