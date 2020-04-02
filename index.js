#!/usr/bin/env node
// processes a hugo post and adds an alias from the old jekyll path
// Intended to be run with a "find" like:
//    find content/post \
//      -type f \
//      -name '*.md' \
//      -exec node /path/to/add-jekyll-alias-to-hugo-post/index.js '{}' \;

const fs = require('fs')
const yaml = require('yaml')
const slugify = require('slugify')

const filePathToProcess = process.argv[2] || process.argv[1]
if (!filePathToProcess) {
  console.error('First param must be a path to an .md file to process')
  process.exit(1)
}
console.log(`Processing file=${filePathToProcess}`)

const data = fs.readFileSync(filePathToProcess, 'utf-8')

const z = '---'
const endOfFrontMatterIndex = data.substring(z.length).indexOf(z) + z.length * 2
const justFrontMatterText = data.substring(
  z.length,
  endOfFrontMatterIndex - z.length,
)

const frontMatter = yaml.parse(justFrontMatterText)
const title = frontMatter.title
const d = new Date(frontMatter.date)
const slug = slugify(title, { remove: /[*+~.()'"!:@]/g, lower: true })
const theAlias = `/${d.getFullYear()}/${d.getMonth() +
  1}/${d.getDate()}/${slug}.html`
console.log(`Adding alias=${theAlias}`)
frontMatter.aliases = [theAlias]
fs.writeFileSync(
  filePathToProcess,
  `---\n${yaml.stringify(frontMatter)}---${data.substring(
    endOfFrontMatterIndex,
  )}`,
)
console.log('Done')
