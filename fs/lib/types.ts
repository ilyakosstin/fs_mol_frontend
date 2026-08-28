namespace tox.types {
    export type FileDirectoryCompactDto = {
        id: string,
        ownerId: string,
        name: string | null,
        isPublic: boolean,
        nFiles: number
    };
}