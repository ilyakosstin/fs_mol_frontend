namespace $.$$ {

	export class $fs_directory_list_item extends $.$fs_directory_list_item {
		dto?: tox.types.FileDirectoryCompactDto

		constructor(dto?: tox.types.FileDirectoryCompactDto) {
			super()
			this.dto = dto
		}

		displayed_name(): string {
			if(this.dto === undefined) {
				return "Null"
			}
			return this.dto.name ?? `FileDirectory(id=${this.dto.id})`
		}

	}

	export class $fs_directory_list_page extends $.$fs_directory_list_page {
		Items() {
			return tox.api.mockDirectoryListData()
				.map((dto : tox.types.FileDirectoryCompactDto) => new $fs_directory_list_item(dto))
		}

	}
}