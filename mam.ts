Error.stackTraceLimit = 50;

declare let _$_: { new(): {} } & typeof globalThis
declare class $ extends _$_ {}

namespace $ {
	export type $ = typeof $$
	export declare class $$ extends $ {
		static $: $
	}
	namespace $$ {
		export type $$ = $
	}
	namespace tox {}
	namespace tox.api {}
	namespace tox.types {}
}

module.exports = $
