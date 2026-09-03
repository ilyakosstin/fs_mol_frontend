namespace $ {

	export type $TokenData = {
        access_token: string,
        refresh_token: string,
        expires_in: number,
        token_type: string,
        scope: string,
        id_token: string
    }

    export type $TokenFetchResult = {
        fetched_at: Date,
        data: $TokenData
    }


    export type $OidData = {
        userid: string
    }
    
    const $tox_oauth2_CLIENT_ID = 'fs-frontend'
    const $tox_oauth2_CLIENT_SECRET = 'fs-frontend-secret' // TODO: to .env
    const $tox_oauth2_EXPIRY_LOOKAHEAD_MS = 5_000
    const $tox_oauth2_LOCAL_STORE_NAME = 'oauth2'

    const $tox_oauth2_SCOPES = [
        'openid',
        'fs.read',
        'fs.write'
    ]

    function $tox_oauth2_redirect_uri() {
        return SELF_BASE_URI() + "/fs/oauth2/callback/index.html"
    }

    export function $tox_oauth2_save_token_fetch_result(fetch_result: $TokenFetchResult) {
        $mol_state_local.value($tox_oauth2_LOCAL_STORE_NAME, fetch_result)
    }

    function $tox_oauth2_get_token(fd: URLSearchParams) : $TokenFetchResult {
        fd.append("client_id", $tox_oauth2_CLIENT_ID)
        fd.append("client_secret", $tox_oauth2_CLIENT_SECRET)

        const data = $mol_fetch.json(AUTH_BASE_URI() + "/oauth2/token", {
            method: "POST",
            body: fd
        } ) as $TokenData

        return {
            fetched_at: new Date(),
            data: data 
        } 
    }

    export function $tox_oauth2_refresh_token_fetch_token(refresh_token: string) {
        const fd = new URLSearchParams()
        fd.append("grant_type", "refresh_token")
        fd.append("refresh_token", refresh_token)
        return $tox_oauth2_get_token(fd)
    }

    export function $tox_oauth2_code_fetch_token(code: string) {
        const fd = new URLSearchParams()
        fd.append("code", code)
        fd.append('redirect_uri', $tox_oauth2_redirect_uri())
        fd.append("grant_type", "authorization_code")
        return $tox_oauth2_get_token(fd)
    }

    export function $tox_oauth2_get_authorization_uri() {
        const baseUri = AUTH_BASE_URI() + "/oauth2/authorize"

        const url = new URL(baseUri);

        url.search = new URLSearchParams({
            redirect_uri: $tox_oauth2_redirect_uri(),
            scope: $tox_oauth2_SCOPES.join(' '),
            response_type: 'code',
            client_id: $tox_oauth2_CLIENT_ID
        }).toString();

        return url.toString()
    }

    export function $tox_oauth2_get_token_data() : $TokenData | null {
        const storage : $TokenFetchResult | null = $mol_state_local.value($tox_oauth2_LOCAL_STORE_NAME) ?? null

        if(storage === null) {
            return null;
        }

        const expires_at = new Date(storage.fetched_at).getTime() + storage.data.expires_in * 1000 // было 3.6 секунды

        if (Date.now() > expires_at - $tox_oauth2_EXPIRY_LOOKAHEAD_MS) {
            // time to update the token

            const newTokenFetch : $TokenFetchResult = $tox_oauth2_refresh_token_fetch_token(storage.data.refresh_token)

            $tox_oauth2_save_token_fetch_result(newTokenFetch)

            return newTokenFetch.data
        }

        return storage.data
    }

    export function $tox_oauth2_get_user_data() : $OidData | null {
        const tokenData = $tox_oauth2_get_token_data()

        if(tokenData === null) {
            return null
        }

        return $mol_jwt_decode(tokenData.id_token).payload as $OidData
    }

    export function $tox_oauth2_get_auth_header()  {
        
        const tokenData = $tox_oauth2_get_token_data()

        if(tokenData === null) {
            return null
        }

        return {
            "Authorization": `Bearer ${tokenData.access_token}`
        }
    }

    export function $tox_oauth2_init_login() {
        $mol_state_arg.go({
            '': '/fs/oauth2/init'
        })
    }

    

}