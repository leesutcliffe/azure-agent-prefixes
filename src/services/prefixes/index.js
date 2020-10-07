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
<<<<<<< HEAD
                resolve($('.link-align').children().attr('href'))
=======
                const prefixUrl = $('.link-align').children().attr('href')
                console.log(`Found prefix url: ${prefixUrl}`)
                resolve(prefixUrl)
>>>>>>> dev1
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
<<<<<<< HEAD
=======
                console.log(`parsing contents of ${url}`)
>>>>>>> dev1
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
        throw new Error('unable to read \'values\' property in response body')
    }
    regions.forEach(region => {
<<<<<<< HEAD
=======
        console.log(`retrieving IP prefixes for region: ${region}`)
>>>>>>> dev1
        AzIpRanges.values.forEach(value => {
            if (!Object.prototype.hasOwnProperty.call(value, 'name')) {
                throw new Error(`unable to read 'values.name[${region}]' property in response body`)
            }

            // push ip ranges on to ipArray
            if (value.name === region) {
<<<<<<< HEAD
                ipArray.push(value.properties.addressPrefixes)
=======
                // filter out any IPv6 address (IPv4 addresses contain '.' notation)
                const prefixes = value.properties.addressPrefixes.filter(prefix => prefix.includes('.'))
                ipArray.push(prefixes)
>>>>>>> dev1
            }
        })
    })

    // flatten array and return as string
    const flatten = ipArray.flat()
<<<<<<< HEAD
    return flatten.toString()
=======
    return JSON.stringify(flatten)
>>>>>>> dev1
}

module.exports = {
    returnDownloadUrl,
    getAzPrefixes,
    extractIps
}
