const chai = require('chai');
const chaiAsPromised = require("chai-as-promised")
const expect = chai.expect;
chai.use(chaiAsPromised)

const kvSave = require('../../../../src/services/keyvault')

describe('savePrefixesAndVerify tests', () => {

    // Mock Az contructors
    function MockDefaultAzureCredential() {
        this.cred = "ABCDE"
      }

    function MockSecretClient() {
        this.setSecret = function(name, value) {
            return name + " added"
        }
        this.getSecret = function(name) {
            return {value: "12345"}
        }
    }

    it('should return true if secret has been set', async () => {  
        const data = kvSave.prefixes({name: "name-of-secret", value: "12345"}, MockDefaultAzureCredential, MockSecretClient).catch(console.error)
        return Promise.all([      
            expect(data).to.eventually.be.true
        ])
    })

    it('should not return true if secret does not match kv', async () => {  
        const data = kvSave.prefixes({name: "name-of-secret", value: "1234"}, MockDefaultAzureCredential, MockSecretClient).catch(console.error)
        return Promise.all([      
            expect(data).to.eventually.not.true
        ])
    })


})