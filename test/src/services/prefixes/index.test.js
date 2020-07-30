const chai = require('chai');
const chaiAsPromised = require("chai-as-promised")
const expect = chai.expect;
const cheerio = require('cheerio')
chai.use(chaiAsPromised)
var fs = require('fs');

const { returnDownloadUrl, getAzPrefixes, extractIps } = require('../../../../src/services/prefixes')
const ranges = require('./ranges.json')

const html = fs.readFileSync('test/src/services/prefixes/source.html', "utf8");

describe('returnDownloadUrl tests', () => {

    function gotMock(url) {
        return new Promise((resolve, reject) => {
            resolve({body: html})
        })
    }

    function gotError(url){
        return new Promise((resolve, reject) => {
            reject('some error')
        })
    }

    it('resolves promise in returnDownloadUrl and retuns a value', async function() {
        const data = await returnDownloadUrl(gotMock, "http://test.local", cheerio)
        return Promise.all([      
            expect(data).to.equal('https://download.microsoft.com/download/7/1/D/71D86715-5596-4529-9B13-DA13A5DE5B63/ServiceTags_Public_20200720.json')
        ])
    })

    it('catches an error in returnDownloadUrl', function() {
        const data = returnDownloadUrl(gotError, "http://test.local", cheerio)
        return Promise.all([
            expect(data).to.be.rejectedWith('some error')
        ])
    })
})

describe('getAzPrefixes tests', () => {
    function gotMockJson(url) {
        return new Promise((resolve, reject) => {
            json = JSON.stringify(ranges)
            resolve({body: json})
        })
    }

    function gotError(url){
        return new Promise((resolve, reject) => {
            reject('some error')
        })
    }

    it('resolves promise in getAzPrefixes and retuns the contents of the url', async function() {
        const data = await getAzPrefixes(gotMockJson, "http://test.local")
        return Promise.all([      
           expect(data).to.deep.equal(ranges)
        ])
    })

    it('catches an error in getAzPrefixes', function() {
        const data = getAzPrefixes(gotError, "http://test.local")
        return Promise.all([
            expect(data).to.be.rejectedWith('some error')
        ])
    })
})

describe('extractIps tests', () => {

    const valueNoName = {
        values: [
            {},
            {}
        ]
    }

    it('throws and error if values property is missing', function() {
        expect(() => {extractIps(['AzureCloud.uksouth'], {})}).to.throw()
    })

    it('throws and error if values.name property is missing', function() {
        expect(() => {extractIps(['AzureCloud.uksouth'], valueNoName)}).to.throw()
    })

    it('returns an array of ip ranges in the given region', () => {
        const data = extractIps(['AzureCloud.uksouth'], ranges)
        console.log(data)
        expect(data).to.be.an('string').that.includes('13.104.129.128/26')
    })

})
