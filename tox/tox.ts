namespace $ {
	
 	export type $TestDto = {
        radio: string
    }

    // если добавить $ то придется класть по тому пути как называется функция \\ что бы проверить запусти npx mam  bog/tox/fs/tox 
    // когда с $ и когда без 
    export function tox_resolve_test() : $TestDto {
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
