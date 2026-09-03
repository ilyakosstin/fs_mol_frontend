namespace $.$$ {
    export class $bog_tox_fs_oauth2_callback extends $.$bog_tox_fs_oauth2_callback {

        /**
         * @ $mol_action, а не async: обработчик синхронный, подвисание
         * идёт через throw-promise фибры, а async его проглатывает.
         */
        @ $mol_action
        token() {
            this.$.$bog_tox_fs_tox_oauth2_exchange( this.code() )
        }

        @ $mol_mem
        code() : string {
            const search = this.$.$mol_dom_context.location.search
            return new URLSearchParams( search ).get( "code" ) ?? ""
        }

    }
}
