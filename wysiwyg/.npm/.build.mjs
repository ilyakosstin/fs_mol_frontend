// @ts-check
/**
 * Кладёт браузерные ассеты TinyMCE из npm в `.npm/-/tinymce`,
 * откуда `deploy` из `wysiwyg.meta.tree` копирует их в бандл приложения.
 * Запускается на каждой сборке $mol, поэтому быстро выходит, когда всё на месте.
 */

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import {
	cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from 'node:fs'

const here = dirname( fileURLToPath( import.meta.url ) )
const pkg = JSON.parse( readFileSync( join( here, 'package.json' ), 'utf8' ) )
const version = pkg.dependencies.tinymce

const src = join( here, 'node_modules', 'tinymce' )
const dest = join( here, '-', 'tinymce' )
const stamp = join( here, '-', '.tinymce.stamp' )

/** Отпечаток сборки: пересобираем только когда меняется версия или сам скрипт. */
const want = version + ' ' + statSync( fileURLToPath( import.meta.url ) ).mtimeMs

if( existsSync( stamp ) && readFileSync( stamp, 'utf8' ) === want ) {
	process.stdout.write( version )
	process.exit( 0 )
}

if( ! existsSync( join( src, 'package.json' ) ) ) {
	const res = spawnSync(
		'npm', [ 'install', '--no-audit', '--no-fund', '--loglevel=error' ],
		{ cwd: here, stdio: [ 'ignore', 'inherit', 'inherit' ], shell: process.platform === 'win32' },
	)
	if( res.status !== 0 ) throw new Error( `npm install tinymce@${ version } failed` )
}

/** Только минифицированная рантайм-часть — исходники и sourcemap'ы в бандл не нужны. */
const keep = /[.]min[.](js|css)$|[.](woff2?|ttf|eot|svg|gif|png)$/
/** Скины и картиночные эмодзи, которые точно не используются. */
const skip = [
	'skins/ui/tinymce-5',
	'skins/ui/tinymce-5-dark',
	'skins/content/tinymce-5',
	'skins/content/tinymce-5-dark',
	'skins/content/document',
	'skins/content/writer',
	'plugins/emoticons/js/emojiimages.min.js',
]

let count = 0

/** @param { string } dir */
const walk = dir => {
	for( const name of readdirSync( dir ) ) {
		const from = join( dir, name )
		const rel = relative( src, from ).split( '\\' ).join( '/' )
		if( skip.some( it => rel === it || rel.startsWith( it + '/' ) ) ) continue
		if( statSync( from ).isDirectory() ) { walk( from ); continue }
		if( ! keep.test( name ) ) continue
		const to = join( dest, rel )
		mkdirSync( dirname( to ), { recursive: true } )
		cpSync( from, to )
		count += 1
	}
}

rmSync( dest, { recursive: true, force: true } )
mkdirSync( dest, { recursive: true } )
walk( src )
cpSync( join( src, 'license.md' ), join( dest, 'license.md' ) )

writeFileSync( stamp, want )
process.stderr.write( `tinymce@${ version }: ${ count } files -> ${ relative( here, dest ) }\n` )
process.stdout.write( version )
