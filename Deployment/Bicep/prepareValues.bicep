param resourceprefix string
param resourceprefix_name string
param openaiServiceEndpoint string
param openaiServiceModelName string
param openaiServiceEmbeddingModelName string
param cognitiveServiceEndpoint string
param storageAccountName string

resource deployed_ai_service 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: 'openaiservice-${resourceprefix_name}${resourceprefix}'
  scope: resourceGroup()
}

resource deployed_doc_intel_service 'Microsoft.CognitiveServices/accounts@2022-03-01' existing = {
  name: 'cognitiveservice-${resourceprefix_name}${resourceprefix}'
  scope: resourceGroup()
}

resource deployed_cosmosdb 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' existing = {
  name: 'cosmosdb-${resourceprefix_name}${resourceprefix}'
  scope: resourceGroup()
}

resource deployed_azsearch 'Microsoft.Search/searchServices@2023-11-01' existing = {
  name: 'search-${resourceprefix_name}${resourceprefix}'
  scope: resourceGroup()
}

resource deployed_storageaccount 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: 'blob${resourceprefix}'
  scope: resourceGroup()
}

// output aiServiceId string = deployed_ai_service.id

var aiServiceKey = deployed_ai_service.listKeys().key1
var docIntelligentKey = deployed_doc_intel_service.listKeys().key1
var azCosmosDbKey = deployed_cosmosdb.listConnectionStrings().connectionStrings[0].connectionString
var azSearchKey = deployed_azsearch.listAdminKeys().primaryKey
var azBlobKey = deployed_storageaccount.listKeys().keys[0].value

// Get Azure Resource Keys -
var keyValueNames = [
  'Application:AIServices:GPT-4o-mini:Endpoint'
  'Application:AIServices:GPT-4o-mini:Key'
  'Application:AIServices:GPT-4o-mini:ModelName'
  'Application:AIServices:GPT-4o:Endpoint'
  'Application:AIServices:GPT-4o:Key'
  'Application:AIServices:GPT-4o:ModelName'
  'Application:AIServices:TextEmbedding:Endpoint'
  'Application:AIServices:TextEmbedding:Key'
  'Application:AIServices:TextEmbedding:ModelName'
  'Application:Services:CognitiveService:DocumentIntelligence:APIKey'
  'Application:Services:CognitiveService:DocumentIntelligence:Endpoint'
  'Application:Services:KernelMemory:Endpoint'
  'Application:Services:PersistentStorage:CosmosMongo:Collections:ChatHistory:Collection'
  'Application:Services:PersistentStorage:CosmosMongo:Collections:ChatHistory:Database'
  'Application:Services:PersistentStorage:CosmosMongo:Collections:DocumentManager:Collection'
  'Application:Services:PersistentStorage:CosmosMongo:Collections:DocumentManager:Database'
  'Application:Services:PersistentStorage:CosmosMongo:ConnectionString'
  'Application:Services:AzureAISearch:APIKey'
  'Application:Services:AzureAISearch:Endpoint'
  'KernelMemory:Services:AzureAIDocIntel:APIKey'
  'KernelMemory:Services:AzureAIDocIntel:Endpoint'
  'KernelMemory:Services:AzureAISearch:APIKey'
  'KernelMemory:Services:AzureAISearch:Endpoint'
  'KernelMemory:Services:AzureBlobs:Account'
  'KernelMemory:Services:AzureBlobs:ConnectionString'
  'KernelMemory:Services:AzureBlobs:Container'
  'KernelMemory:Services:AzureOpenAIEmbedding:APIKey'
  'KernelMemory:Services:AzureOpenAIEmbedding:Deployment'
  'KernelMemory:Services:AzureOpenAIEmbedding:Endpoint'
  'KernelMemory:Services:AzureOpenAIText:APIKey'
  'KernelMemory:Services:AzureOpenAIText:Deployment'
  'KernelMemory:Services:AzureOpenAIText:Endpoint'
  'KernelMemory:Services:AzureQueues:Account'
  'KernelMemory:Services:AzureQueues:ConnectionString'
]

var keyValueValues = [
  openaiServiceEndpoint
  aiServiceKey
  openaiServiceModelName
  openaiServiceEndpoint
  aiServiceKey
  openaiServiceModelName
  openaiServiceEndpoint
  aiServiceKey
  openaiServiceEmbeddingModelName
  docIntelligentKey
  cognitiveServiceEndpoint
  'http://kernel-memory'
  'ChatHistory'
  'DPS'
  'Documents'
  'DPS'
  azCosmosDbKey
  azSearchKey
  'https://search-${resourceprefix_name}${resourceprefix}.search.windows.net'
  docIntelligentKey
  cognitiveServiceEndpoint
  azSearchKey
  'https://search-${resourceprefix_name}${resourceprefix}.search.windows.net'
  storageAccountName
  azBlobKey
  'smemory'
  aiServiceKey
  openaiServiceEmbeddingModelName
  openaiServiceEndpoint
  aiServiceKey
  openaiServiceModelName
  openaiServiceEndpoint
  storageAccountName
  azBlobKey
]

output keyvalueNames array = keyValueNames
output keyValueValues array = keyValueValues
