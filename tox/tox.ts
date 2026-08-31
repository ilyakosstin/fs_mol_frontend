
namespace $ {
    export const $tox_SELF_BASE_URI = 'http://localhost:9080'
    export const $tox_AUTH_BASE_URI = 'http://auth.local.test:9000'
    export const $tox_FS_BASE_URI = 'http://fs.local.test:8000'

    async function sleep(ms: number) {
        return new Promise((resolve, _) => setTimeout(resolve, ms))
    }

    export async function $tox_resolve_test() : Promise<$TestDto> {
    

        return fetch(`${$tox_FS_BASE_URI}/test`)
            .then(res => res.json())
            .then(body => body as $TestDto)
    }

    



    export type $TestDto = {
        radio: string
    }




}