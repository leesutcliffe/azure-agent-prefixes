# Azure Agent IP Retrieval
 
Obtains the current list of Azure IP prefixes and stores the requested region prexies in Key vault.
 
## Description
 
If you have firewalls or NSG rules that restrict access to your Azure hosted services then you may have had an issue whereby Azure Devops agents are not able to access your services.
Each Wednesday, Microsoft releases an updated list of IPs used by various Azure services, including the Azure DevOps agents.
The list is published in JSON format however finding the URL requires an element of web scraping to assolate the relevant DOM within the HTML.
 
This tool will obtain the location of the weekly published prefix list and extract the requested prefixes for the region your services are located.
 
The list of prefixes is then added to an Azure Key vault, they can be used at a later date, such as in a Terraform plan.
 
Simply schedule this task each week in order to obtain the up to date list of prefixes used by Azure.
 
## Getting Started
 
### Requirements
 
This tool will require Node.js ES2019 support in order to support the ```Array.prototype.flat()``` method
 
### Install
 
```
npm install
```
 
### Configuration options
 
Configurable parameters are stored in ```src/config/config.json```
 
```JSON
{
   "msUrl": "https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519",
   "regions": [
       "AzureCloud.uksouth"
   ],
   "secretName": "az-agent-prefixes"
}
```
 
* msUrl - The Microsoft URL which prompts the download of the list Azure prefixes
* regions - The list of regions where your services are hosted
* secretName - The name of the secret in Azure Key vault
 
### Azure Environment Variables
 
In order for the tool to access Azure Key vault, you will need to add a service principal and add it to the key vault policy. Details how to do this is out of the scope of this document but information how to find it (and on the Node.js azure-secret library) can be found [here](https://docs.microsoft.com/en-us/azure/key-vault/secrets/quick-create-node)
 
Once the service principal and key vault has been setup, configure your environment variables as follows:
 
```console
export AZURE_CLIENT_ID=<your-clientID>
export AZURE_CLIENT_SECRET=<your-clientSecret>
export AZURE_TENANT_ID=<your-tenantId>
export KEY_VAULT_NAME=<your-key-vault-name>
```
 
### Executing program
 
Run the following command to run the tool
```
node src/index.js
```
 
## License
 
This project is licensed under the MIT License - see the LICENSE.md file for details
 
 

