/**
 * Exports every single lexicon file ending in .json.
 */
import fs from 'fs'
import * as path from 'path'
import Debug from 'debug'
import {Lexicons} from '@atproto/lexicon'

export const lex = new Lexicons()

// search every subfolder recursively for .json files. Assign each lexicon to a key in an object with the lexicon's ID ("id" key)
const log = Debug('lexicons:walk')
export const lexicons: {
    list: any[]
    implemented: any[]
    walked: boolean
} = {
    list: [],
    implemented: [],
    walked: false,
}

const walk = function (
    dir: string,
    done: {
        (err: NodeJS.ErrnoException | null, res?: string[]): void;
    }) {
    let results: any[] = []
    fs.readdir(dir, function (err, list) {
        if (err) {
            log(`Error walking ${dir}: ${err.message}`)
            return done(err)
        }
        let pending = list.length
        if (!pending) return done(null, results)
        list.forEach(function (file) {
            file = path.resolve(dir, file)
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res)
                        if (!--pending) done(null, results)
                    })
                } else {
                    results.push(file)
                    if (!--pending) done(null, results)
                }
            })
        })
    })
}

walk(__dirname, async function (err, results) {
    if (err) throw err
    if (!results) throw new Error('No results found')

    for (const file of results) {
        if (file.endsWith('.json')) {
            const lexicon = await import(file).then((m) => m.default);
            if (!lexicons.list[lexicon.id]) {
                lexicons.list[lexicon.id] = lexicon
                lex.add(lexicon)
            }
        } else if (file.endsWith('.ts')) {
            if (file.endsWith('index.ts')) continue;
            const lexiconID = file.replace(__dirname, '').replace(/\\/g, '.').replace(/\//g, '.').replace('.ts', '').replace('.', '') // < replaces first dot.
            if (!lexicons.implemented.includes(lexiconID)) {
                lexicons.implemented.push(lexiconID)
            }
        } else {
            log(`err: unknown file: ${file}`)
        }
    }

    log(`Found ${Object.keys(lexicons.list).length} lexicons.`)
    log(`Found ${lexicons.implemented.length} implemented lexicons.`)

    lexicons.walked = true;
    return lexicons;
})

export default lexicons