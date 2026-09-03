namespace $ {
	
 	export type $TestDto = {
        radio: string
    }

    export function $tox_resolve_test() : $TestDto {
        return $mol_fetch.json(`${SELF_BASE_URI()}/test`) as $TestDto
    }
    
    export function SELF_BASE_URI() {
		return 'http://localhost:9080'
	}
	
	export function AUTH_BASE_URI () {
		return 'http://auth.local.test:9000'
	}
	
	export function FS_BASE_URI () {
		return 'http://fs.local.test:8000'
	}
    
}
