
namespace $.$$ {

    export class $bog_tox_fs_local extends $.$bog_tox_fs_local {

        @ $mol_mem
        code_local(next?: string) : string {
            if(next === undefined) {
                return $mol_state_local.value("code") ?? ""
            }
            $mol_state_local.value("code", next)
            return next
        }

        @ $mol_mem
        code_query(next?: string) : string {
            if(next === undefined) {
                return new URLSearchParams(this.$.$mol_dom_context.location.search).get('code') ?? ""
            }
            return next
        }

    }


}