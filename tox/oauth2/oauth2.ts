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
    
    const CLIENT_ID = 'fs-frontend'

    const $bog_tox_fs_tox_oauth2_SCOPES = [
        'openid',
        'fs.read',
        'fs.write'
    ]

    function $bog_tox_fs_tox_oauth2_redirect_uri() {
        return SELF_BASE_URI() + "/fs/oauth2/callback/index.html"
    }

    export function $bog_tox_fs_tox_oauth2_stored( next?: $bog_tox_fs_tox_oauth2_token_stored | null ) {
             return $mol_state_local.value< $bog_tox_fs_tox_oauth2_token_stored >( $bog_tox_fs_tox_oauth2_STORE, next )
    }

    function $bog_tox_fs_tox_oauth2_fetch( fd: URLSearchParams ): $bog_tox_fs_tox_oauth2_token_stored {
             fd.set( 'client_id', CLIENT_ID )

             const data = $mol_fetch.json( AUTH_BASE_URI() + '/oauth2/token', {
                     method: 'POST',
                     body: fd,
             } ) as $bog_tox_fs_tox_oauth2_token

             return { fetched_at: Date.now(), data }
    }

     @ $mol_action
     export function $bog_tox_fs_tox_oauth2_exchange( code: string ) {
             const fd = new URLSearchParams({
                     grant_type: 'authorization_code',
                     code,
                     redirect_uri: $bog_tox_fs_tox_oauth2_redirect_uri(),
             })
             const stored = $bog_tox_fs_tox_oauth2_fetch( fd )
             $bog_tox_fs_tox_oauth2_stored( stored )
             return stored
    }

     @ $mol_action
     export function $bog_tox_fs_tox_oauth2_refresh( refresh_token: string ) {
             const fd = new URLSearchParams({ grant_type: 'refresh_token', refresh_token })
             const stored = $bog_tox_fs_tox_oauth2_fetch( fd )
             $bog_tox_fs_tox_oauth2_stored( stored )
             return stored
     }

    export function $bog_tox_fs_tox_oauth2_token_data(): $bog_tox_fs_tox_oauth2_token | null {
             const stored = $bog_tox_fs_tox_oauth2_stored()
             if( !stored ) return null

             const expires_at = stored.fetched_at + stored.data.expires_in * 1000
             if( Date.now() < expires_at - $bog_tox_fs_tox_oauth2_LOOKAHEAD ) return stored.data

             return $bog_tox_fs_tox_oauth2_refresh( stored.data.refresh_token ).data
    }

    export function $bog_tox_fs_tox_oauth2_user_data(): $bog_tox_fs_tox_oauth2_oid | null {
             const token = $bog_tox_fs_tox_oauth2_token_data()
             return token && $mol_jwt_decode( token.id_token ).payload as $bog_tox_fs_tox_oauth2_oid
    }

    export function $bog_tox_fs_tox_oauth2_auth_header() {
             const token = $bog_tox_fs_tox_oauth2_token_data()
             return token && { Authorization: `Bearer ${ token.access_token }` }
    }

    export function $bog_tox_fs_tox_oauth2_authorization_uri() {
             const url = new URL( AUTH_BASE_URI() + '/oauth2/authorize' )
             url.search = new URLSearchParams({
                     redirect_uri: $bog_tox_fs_tox_oauth2_redirect_uri(),
                     scope: $bog_tox_fs_tox_oauth2_SCOPES.join(' '),
                     response_type: 'code',
                     client_id: CLIENT_ID,
             }).toString()
             return url.toString()
    }

    export function $bog_tox_fs_tox_oauth2_init_login() {
             $mol_dom_context.location.href = SELF_BASE_URI() + '/fs/oauth2/init/index.html'
    }

}
