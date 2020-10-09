
const cheerio = require('cheerio')
const { DefaultAzureCredential } = require('@azure/identity')
const got = require('got')
const { SecretClient } = require('@azure/keyvault-secrets')
const validator = require('validator')

const kvSave = require('./services/keyvault')
const { extractIps, getAzPrefixes, returnDownloadUrl } = require('./services/prefixes')
const { msUrl, regions, secretName } = require('./config/config.json')

// start app
main()

async function main() {
    console.log('app started...')
    const url = await returnDownloadUrl(got, msUrl, cheerio)
    const azPrefixes = await getAzPrefixes(got, url)
    const azPrefixList = extractIps(regions, azPrefixes, validator)
    const secret = {
        name: secretName,
        value: azPrefixList
    }
    kvSave.prefixes(secret, DefaultAzureCredential, SecretClient)
        .catch(err => {
            console.log(err)
            process.exit(1)
        })
}
