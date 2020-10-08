module.exports = {
    extractIps,
    getAzPrefixes,
    returnDownloadUrl
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
                const prefixUrl = $('.link-align').children().attr('href')
                console.log(`Found prefix url: ${prefixUrl}`)
                resolve(prefixUrl)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Returns the contents of the Azure IP ranges JSON file
 *
 * @param {*} get - Got function passed as argument
 * @param {*} url - location of weekly Azure IP json file
 */
function getAzPrefixes(get, url) {
    return new Promise(function (resolve, reject) {
        get(url)
            .then(res => {
                console.log(`parsing contents of ${url}`)
                const parsed = JSON.parse(res.body)
                resolve(parsed)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Returns an array of all ip ranges for the requested regions
 *
 * @param {Array} regions - list of required regions
 * @param {object} AzIpRanges - Parsed JSON object containing published Azure IP ranges
 * @param {function} validator - Validator function passed as argument
 */
function extractIps(regions, AzIpRanges, validator) {
    // initialise eempty array
    let prefixes = []

    // validate value property
    if (!Object.prototype.hasOwnProperty.call(AzIpRanges, 'values')) {
        throw new Error('unable to read \'values\' property in response body')
    }
    regions.forEach(region => {
        console.log(`retrieving IP prefixes for region: ${region}`)
        AzIpRanges.values.forEach(value => {
            if (!Object.prototype.hasOwnProperty.call(value, 'name')) {
                throw new Error(`unable to read 'values.name[${region}]' property in response body`)
            }

            // push ip ranges on to prefixes - exlude any IPv6 (isIPRange IPv4 only https://www.npmjs.com/package/validator)
            if (value.name === region) {
                prefixes = value.properties.addressPrefixes.filter(prefix => {
                    return validator.isIPRange(prefix)
                })
            }
        })
    })

    // flatten array and return as string
    const flattened = prefixes.flat()
    return JSON.stringify(flattened)
}
