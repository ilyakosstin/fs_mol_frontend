namespace $ {
	
    export function $tox_fs_get_directories() {
        return $mol_fetch.json(SELF_BASE_URI() + "/directories", {
            headers: $bog_tox_fs_tox_oauth2_get_auth_header() ?? {}
        }) as $FileDirectoryCompactDto[]
    }

    export type $FileDirectoryCompactDto = {
        id: string,
        ownerId: string,
        name: string | null,
        isPublic: boolean,
        nFiles: number
    };

    export function $tox_fs_mock_directories() : $FileDirectoryCompactDto[] {
        return [
            {
                id: "UUID1",
                ownerId: "UUID2",
                name: "Lakhta walk",
                isPublic: true,
                nFiles: 2
            },
            {
                id: "UUID1",
                ownerId: "UUID2",
                name: null,
                isPublic: true,
                nFiles: 2
            }
        ]
    }
}