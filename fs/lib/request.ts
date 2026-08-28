namespace tox.api {
    export function mockDirectoryListData() : types.FileDirectoryCompactDto[] {
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