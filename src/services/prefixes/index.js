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
 * @param {*} get - Got function passed as argument
 * @param {*} url - location of weekly Azure IP json file
 */
function getAzPrefixes(get, url) {
    return new Promise(function (resolve, reject) {
        get(url)
            .then(res => {
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
 */
function extractIps(regions, AzIpRanges) {
    // initialise eempty array
    const ipArray = []

    // validate value property
    if (!Object.prototype.hasOwnProperty.call(AzIpRanges, 'values')) {
        throw new Error(`unable to read \'values\' property in response body`)
    }
    regions.forEach(region => {
        AzIpRanges.values.forEach(value => {
            if (!Object.prototype.hasOwnProperty.call(value, 'name')) {
                throw new Error(`unable to read \'values.name[${region}]\' property in response body`)
            }

            // push ip ranges on to ipArray
            if (value.name === region) {
                ipArray.push(value.properties.addressPrefixes)
            }
        })
    })

    //flatten array and return as string
    const flatten = ipArray.flat()
    return flatten.toString()
}

module.exports = {
    returnDownloadUrl,
    getAzPrefixes,
    extractIps
}
