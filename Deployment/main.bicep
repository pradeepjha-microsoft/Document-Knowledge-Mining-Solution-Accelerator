// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
targetScope = 'subscription'

@description('The location where the resources will be created.')
@allowed([
  'EastUS'
  'EastUS2'
  'WestUS'
  'WestUS2'
  'WestUS3'
  'CentralUS'
  'NorthCentralUS'
  'SouthCentralUS'
  'WestEurope'
  'NorthEurope'
  'SoutheastAsia'
  'EastAsia'
  'JapanEast'
  'JapanWest'
  'AustraliaEast'
  'AustraliaSoutheast'
  'CentralIndia'
  'SouthIndia'
  'CanadaCentral'
  'CanadaEast'
  'UKSouth'
  'UKWest'
  'FranceCentral'
  'FranceSouth'
  'KoreaCentral'
  'KoreaSouth'
  'GermanyWestCentral'
  'GermanyNorth'
  'NorwayWest'
  'NorwayEast'
  'SwitzerlandNorth'
  'SwitzerlandWest'
  'UAENorth'
  'UAECentral'
  'SouthAfricaNorth'
  'SouthAfricaWest'
  'BrazilSouth'
  'BrazilSoutheast'
  'QatarCentral'
  'ChinaNorth'
  'ChinaEast'
  'ChinaNorth2'
  'ChinaEast2'
])
param location string

@description('The Data Center where the model is deployed.')
@allowed([
  'EastUS'
  'EastUS2'
  'SwedenCentral'
  'WestUS3'
])
param modeldatacenter string

@description('The AI Service Image Repository')
param aiserviceimagerepository string = 'csacto.azurecr.io/kmgs/aiservice'

@description('The Document Processor Image Tag')
param documentprocessorrepository string = 'csacto.azurecr.io/kmgs/kernelmemory'

@description('The Front App Image Tag')
param frontapprepository string = 'csacto.azurecr.io/kmgs/frontapp'

var resourceprefix = padLeft(take(uniqueString(deployment().name), 5), 5, '0')
var resourceprefix_name = 'kmgs'

// Create a resource group
resource gs_resourcegroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${resourceprefix_name}${resourceprefix}'
  location: location
}

// Create a storage account
module gs_storageaccount 'bicep/azurestorageaccount.bicep' = {
  name: 'blob${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    storageAccountName: 'blob${resourceprefix}'
    location: deployment().location
  }
}

// Create a Azure Search Service
module gs_azsearch 'bicep/azuresearch.bicep' = {
  name: 'search-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    searchServiceName: 'search-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// Create Container Registry
module gs_containerregistry 'bicep/azurecontainerregistry.bicep' = {
  name: 'acr${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    acrName: 'acr${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// Create Azure Cognitive Service
module gs_azcognitiveservice 'bicep/azurecognitiveservice.bicep' = {
  name: 'cognitiveservice-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    cognitiveServiceName: 'cognitiveservice-${resourceprefix_name}${resourceprefix}'
    location: 'eastus'
  }
}

// Create Azure Open AI Service
module gs_openaiservice 'bicep/azureopenaiservice.bicep' = {
  name: 'openaiservice-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    openAIServiceName: 'openaiservice-${resourceprefix_name}${resourceprefix}'
    // GPT-4-32K model & GPT-4o available Data center information.
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4    
    location: modeldatacenter
  }
}

// Due to limited of Quota not easy to control per each model deployment.
// Set the minimum capacity of each model
// Based on customer's Model capacity, it needs to be updated in Azure Portal.
module gs_openaiservicemodels_gpt4o 'bicep/azureopenaiservicemodel.bicep' = {
  scope: gs_resourcegroup
  name: 'gpt-4o-mini'
  params: {
    parentResourceName: gs_openaiservice.outputs.openAIServiceName
    name: 'gpt-4o-mini'
    model: {
      name: 'gpt-4o-mini'
      version: '2024-07-18'
      raiPolicyName: ''
      capacity: 1
      scaleType: 'Standard'
    }
  }
  dependsOn: [
    gs_openaiservice
  ]
}

module gs_openaiservicemodels_text_embedding 'bicep/azureopenaiservicemodel.bicep' = {
  scope: gs_resourcegroup
  name: 'text-embedding-large'
  params: {
    parentResourceName: gs_openaiservice.outputs.openAIServiceName
    name: 'text-embedding-large'
    model: {
      name: 'text-embedding-3-large'
      version: '1'
      raiPolicyName: ''
      capacity: 1
      scaleType: 'Standard'
    }
  }
  dependsOn: [
    gs_openaiservicemodels_gpt4o
  ]
}

// Create Azure Cosmos DB Mongo
module gs_cosmosdb 'bicep/azurecosmosdb.bicep' = {
  name: 'cosmosdb-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    cosmosDbAccountName: 'cosmosdb-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// Prepare Values
module gs_preparevalues 'bicep/prepareValues.bicep' = {
  name: 'prepareValues'
  scope: gs_resourcegroup
  params: {
    resourceprefix: resourceprefix
    resourceprefix_name: resourceprefix_name
    openaiServiceEndpoint: gs_openaiservice.outputs.openAIServiceEndpoint
    openaiServiceModelName: gs_openaiservicemodels_gpt4o.outputs.deployedModelName
    openaiServiceEmbeddingModelName: gs_openaiservicemodels_text_embedding.outputs.deployedModelName
    cognitiveServiceEndpoint: gs_azcognitiveservice.outputs.cognitiveServiceEndpoint
    storageAccountName: gs_storageaccount.outputs.storageAccountName
  }
  dependsOn: [
    gs_storageaccount
    gs_azsearch
    // gs_aks
    gs_azcognitiveservice
    gs_openaiservice
    gs_openaiservicemodels_gpt4o
    gs_openaiservicemodels_text_embedding
    gs_cosmosdb
  ]
}

//Create Azure App Configuration
module gs_appconfig 'bicep/azureappconfigservice.bicep' = {
  name: 'appconfig-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    appConfigName: 'appconfig-${resourceprefix_name}${resourceprefix}'
    keyValueNames: gs_preparevalues.outputs.keyvalueNames
    keyValueValues: gs_preparevalues.outputs.keyValueValues
  }
  dependsOn: [
    gs_openaiservice
    gs_azcognitiveservice
    gs_cosmosdb
    gs_azsearch
    gs_storageaccount
    gs_openaiservicemodels_gpt4o
    gs_openaiservicemodels_text_embedding
    gs_preparevalues
  ]
}

//Create Log Analysis for Azure Container Apps
module gs_loganalysis 'bicep/azureloganalysis.bicep' = {
  name: 'loganalysis-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    workspaceName: 'loganalysis-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

//Create Azure Container App Environment
module gs_containerappenv 'bicep/azurecontainerappenv.bicep' = {
  name: 'containerappenv-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    environmentName: 'env-dkm'
    loganalysisName: gs_loganalysis.outputs.workspaceName
  }
}

//Create Azure Container App - Kernel Memory
module gs_containerapp_kernel_memory 'bicep/azurecontainerapp.bicep' = {
  name: 'containerappkm-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    containerappName: 'kernel-memory'
    environmentid: gs_containerappenv.outputs.environmentId
    containerimagename: 'kernelmemory'
    containerimagetag: documentprocessorrepository
    targetPort: 9001
    envvars: [
      {
        name: 'APP_CONFIG_ENDPOINT'
        value: gs_appconfig.outputs.appConfigEndpoint
      }
    ]
  }
  dependsOn: [
    gs_containerappenv
  ]
}

//Add App Config Data Reader role to App Config
module gs_roleassignappconfig 'bicep/azureroleassignappconfig.bicep' = {
  name: 'assignAppConfigRole'
  scope: gs_resourcegroup
  params: {
    principalId: gs_containerapp_kernel_memory.outputs.managedIdentityPrincipalId
    appConfigName: gs_appconfig.outputs.appConfigServiceName
  }

  dependsOn: [
    gs_containerapp_kernel_memory
    gs_appconfig
  ]
}

//Add Storage Blob Data Contributor role to storage account
module gs_roleassignstorageblob 'bicep/azureroleassignstorageblob.bicep' = {
  name: 'assignStorageBlobRole'
  scope: gs_resourcegroup
  params: {
    principalId: gs_containerapp_kernel_memory.outputs.managedIdentityPrincipalId
    storageBlobName: gs_storageaccount.outputs.storageAccountName
  }
  dependsOn: [
    gs_containerapp_kernel_memory
    gs_storageaccount
  ]
}

//Add Storage Queue Data Contributor role to storage account
module gs_roleassignstoragequeue 'bicep/azureroleassignstoragequeue.bicep' = {
  name: 'assignStorageQueueRole'
  scope: gs_resourcegroup
  params: {
    principalId: gs_containerapp_kernel_memory.outputs.managedIdentityPrincipalId
    storageAccount: gs_storageaccount.outputs.storageAccountName
  }
  dependsOn: [
    gs_containerapp_kernel_memory
    gs_storageaccount
  ]
}

//Create Azure Container App - AI Service
module gs_containerapp_ai_service 'bicep/azurecontainerapp.bicep' = {
  name: 'containerappaiservice-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    containerappName: 'ai-service'
    environmentid: gs_containerappenv.outputs.environmentId
    containerimagename: 'aiservice'
    containerimagetag: aiserviceimagerepository
    isIngress: true
    targetPort: 9001
    envvars: [
      {
        name: 'APP_CONFIG_ENDPOINT'
        value: gs_appconfig.outputs.appConfigEndpoint
      }
    ]
  }
  dependsOn: [
    gs_containerappenv
  ]
}

//Add App Config Data Reader role to App Config
module gs_roleassignappconfig_aiservice 'bicep/azureroleassignappconfig.bicep' = {
  name: 'assignAppConfigRoleAIService'
  scope: gs_resourcegroup
  params: {
    principalId: gs_containerapp_ai_service.outputs.managedIdentityPrincipalId
    appConfigName: gs_appconfig.outputs.appConfigServiceName
  }
  dependsOn: [
    gs_containerapp_ai_service
    gs_appconfig
  ]
}

//Add Storage Blob Data Contributor role to storage account
module gs_roleassignstorageblob_aiservice 'bicep/azureroleassignstorageblob.bicep' = {
  name: 'assignStorageBlobRoleAIService'
  scope: gs_resourcegroup
  params: {
    principalId: gs_containerapp_ai_service.outputs.managedIdentityPrincipalId
    storageBlobName: gs_storageaccount.outputs.storageAccountName
  }
  dependsOn: [
    gs_containerapp_ai_service
    gs_storageaccount
  ]
}

//Create Azure Container App - FrontApp
module gs_containerapp_frontapp 'bicep/azurecontainerapp.bicep' = {
  name: 'containerappfron-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    containerappName: 'frontapp'
    environmentid: gs_containerappenv.outputs.environmentId
    containerimagename: 'frontapp'
    containerimagetag: frontapprepository
    isIngress: true
    targetPort: 5900
    envvars: [
      {
        name: 'DISABLE_AUTH'
        value: 'true'
      }
      {
        name: 'VITE_API_ENDPOINT'
        value: 'https://${gs_containerapp_ai_service.outputs.fqdn}'
      }
    ]
  }
  dependsOn: [
    gs_containerappenv
    gs_containerapp_ai_service
  ]
}

output WebAppUrl string = gs_containerapp_frontapp.outputs.fqdn
// return all resource names as a output
output gs_resourcegroup_name string = 'rg-${resourceprefix_name}${resourceprefix}'
output gs_storageaccount_name string = gs_storageaccount.outputs.storageAccountName
output gs_azsearch_name string = gs_azsearch.outputs.searchServiceName
// output gs_aks_name string = gs_aks.outputs.createdAksName
// output gs_aks_serviceprincipal_id string = gs_aks.outputs.createdServicePrincipalId
output gs_containerregistry_name string = gs_containerregistry.outputs.createdAcrName
output gs_azcognitiveservice_name string = gs_azcognitiveservice.outputs.cognitiveServiceName
output gs_azcognitiveservice_endpoint string = gs_azcognitiveservice.outputs.cognitiveServiceEndpoint
output gs_openaiservice_name string = gs_openaiservice.outputs.openAIServiceName
output gs_openaiservice_location string = gs_openaiservice.outputs.oopenAIServiceLocation
output gs_openaiservice_endpoint string = gs_openaiservice.outputs.openAIServiceEndpoint
output gs_openaiservicemodels_gpt4o_model_name string = gs_openaiservicemodels_gpt4o.outputs.deployedModelName
output gs_openaiservicemodels_gpt4o_model_id string = gs_openaiservicemodels_gpt4o.outputs.deployedModelId
output gs_openaiservicemodels_text_embedding_model_name string = gs_openaiservicemodels_text_embedding.outputs.deployedModelName
output gs_openaiservicemodels_text_embedding_model_id string = gs_openaiservicemodels_text_embedding.outputs.deployedModelId
output gs_cosmosdb_name string = gs_cosmosdb.outputs.cosmosDbAccountName
output gs_appconfig_id string = gs_appconfig.outputs.appConfigId
output gs_appconfig_endpoint string = gs_appconfig.outputs.appConfigEndpoint

// return acr url
// output gs_containerregistry_endpoint string = gs_containerregistry.outputs.acrEndpoint
//return resourcegroup resource ID
output gs_resourcegroup_id string = gs_resourcegroup.id
