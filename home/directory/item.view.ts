namespace $.$$ {

    export class $bog_tox_fs_home_directory extends $.$bog_tox_fs_home_directory {

        /**
         * Компонент $mol нельзя создавать с аргументами конструктора:
         * базовый класс из view.tree имеет new (). Данные приходят
         * через свойство, которое выставляет владелец.
         */
        override dto() {
            return super.dto() as $bog_tox_fs_tox_fs_directory
        }

        displayed_name() {
            const dto = this.dto()
            return dto.name ?? dto.id
        }

        link_uri() {
            return this.$.$mol_state_arg.link({ directory: this.dto().id })
        }

        additional_info() {
            const dto = this.dto()
            return `(nFiles=${ dto.nFiles }, isPublic=${ dto.isPublic })`
        }

    }
}
