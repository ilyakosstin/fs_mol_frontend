
namespace $.$$ {

    export class $fs_home_directory extends $.$fs_home_directory {

        dto: $FileDirectoryCompactDto
        _index: number

        constructor(dto: $FileDirectoryCompactDto, _index: number) {
            super()
            this.dto = dto
            this._index = _index
        }

        index() {
            return this._index.toString()
        }

        displayed_name() {
            return this.dto.name ?? this.dto.id
        }

        link_uri() {
            return "/fs/directory/" + this.dto.id
        }

        additional_info() {
            return `(nFiles=${this.dto.nFiles}, isPublic=${this.dto.isPublic})`
        }

    }
}