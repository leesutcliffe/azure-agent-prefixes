const keyVaultName = process.env.KEY_VAULT_NAME
const kvUri = 'https://' + keyVaultName + '.vault.azure.net'

const { secretName } = require('../../config/config.json')

/**
 * Sets the value of secretName
 *
 * @param {Object} sec - values of secret name and secretValue
 * @param {FunctionConstructor} DefAzCred - DefaultAzureCredential contructor from @azure/identity
 * @param {FunctionConstructor} SecClient - SecretClient from @azure/keyvault-secrets
 */
async function savePrefixesAndVerify(secret, DefAzCred, SecClient) {
    const credential = new DefAzCred()
    const client = new SecClient(kvUri, credential)
    await client.setSecret(secret.name, secret.value)
    const retrievedSecret = await client.getSecret(secretName)

    if (retrievedSecret.value === secret.value) {
        console.log(`Successfully saved secret: ${secret.name} to ${kvUri}`)
        return true
    }
}

exports.prefixes = savePrefixesAndVerify
