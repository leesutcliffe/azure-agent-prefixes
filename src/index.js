
const got = require('got')
const cheerio = require('cheerio')

const { msUrl, regions } = require('./config/config.json')
const { returnDownloadUrl, getAzureIps, extractIps } = require('./services/prefixes')

// start app
main()

async function main() {
    const url = await returnDownloadUrl(got, msUrl, cheerio)
    const json = await getAzureIps(got, url)
}
