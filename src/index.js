const got = require('got')
const cheerio = require('cheerio')

const msUrl = 'https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519'

const regions = [
    'AzureCloud.uksouth'
]

main()

async function main() {
    const url = await returnDownloadUrl(got, msUrl, cheerio)
    const json = await getAzureIps(got, url)
}

/**
 * Returns the URL for the JSON file containing Azure IPs
 *
 * @param {function} get - Got function passed as argument
 * @param {string} url - MS URL containing the link reference to the download location
 * @param {function} ch - Cheerio function passed as argument
 */
function returnDownloadUrl(get, url, ch) {
    return new Promise(function (resolve, reject) {
        get(url)
            .then(res => {
                const $ = ch.load(res.body)
                resolve($('.link-align').children().attr('href'))
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Returns the contents of the Azure IP ranges JSON file
 *
 * @param {*} get
 * @param {*} url
 */
function getAzureIps(get, url) {
    return new Promise(function (resolve, reject) {
        get(url)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 *
 * @param {Array} regions
 * @param {object} AzIpRanges
 */
function extractIps(regions, AzIpRanges) {
    AzIpRanges.forEach(element => {

    })
}

module.exports = {
    returnDownloadUrl,
    getAzureIps
}
