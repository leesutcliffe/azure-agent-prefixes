
const got = require('got')
const cheerio = require('cheerio')
const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')

const { msUrl, regions, secretName } = require('./config/config.json')
const { returnDownloadUrl, getAzPrefixes, extractIps } = require('./services/prefixes')
const kvSave = require('./services/keyvault')

// start app
main()

async function main() {
    const url = await returnDownloadUrl(got, msUrl, cheerio)
    const azPrefixes = await getAzPrefixes(got, url)
    const azPrefixList = extractIps(regions, azPrefixes)
    const secret = {
        name: secretName,
        value: azPrefixList
    }
    kvSave.prefixes(secret, DefaultAzureCredential, SecretClient)
        .catch(console.error)
}
