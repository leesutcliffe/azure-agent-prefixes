const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')
const keyVaultName = process.env.KEY_VAULT_NAME
const kvUri = 'https://' + keyVaultName + '.vault.azure.net'

const { secretName } = require('../../config/config.json')

main()
//savePrefixesAndVerify("BLAH!!!")
function main() {
    try {
        savePrefixesAndVerify("BLAH!!!")
    } catch(err) {
        console.error(err)
    }   
}




function savePrefixesAndVerify(secretValue) {
        return new Promise(async function (resolve, reject) {
            const credential = new DefaultAzureCredential()
            const client = new SecretClient(kvUri, credential)
            await client.setSecret(secretName, secretValue)
            const retrievedSecret = await client.getSecret(secretName)
            if (retrievedSecret === secretValue) {
                resolve() 
            } else {
                reject('error')
            }    
        })

}

exports.savePrefixes = savePrefixesAndVerify
