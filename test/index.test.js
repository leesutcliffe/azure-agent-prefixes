const chai = require('chai');
const chaiAsPromised = require("chai-as-promised")
const expect = chai.expect;
const cheerio = require('cheerio')
chai.use(chaiAsPromised)
var fs = require('fs');

const { returnDownloadUrl, getAzureIps } = require('../src')
const ranges = require('./ranges.json')

const html = fs.readFileSync('test/source.html', "utf8");

describe('returnDownloadUrl tests', () => {

    function gotMock(url) {
        return new Promise((resolve, reject) => {
            resolve({body: html})
        })
    }

    function gotMockJson(url) {
        return new Promise((resolve, reject) => {
            resolve(ranges)
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

describe('getAzureIps tests', () => {
    function gotMockJson(url) {
        return new Promise((resolve, reject) => {
            resolve(ranges)
        })
    }

    function gotError(url){
        return new Promise((resolve, reject) => {
            reject('some error')
        })
    }

    it('resolves promise in getAzureIps and retuns the contents of the url', async function() {
        const data = await getAzureIps(gotMockJson, "http://test.local")
        return Promise.all([      
           expect(data).to.equal(ranges)
        ])
    })

    it('catches an error in getAzureIps', function() {
        const data = getAzureIps(gotError, "http://test.local")
        return Promise.all([
            expect(data).to.be.rejectedWith('some error')
        ])
    })
})