param appConfigName string
param location string = resourceGroup().location
param skuName string = 'Standard'
param keyValueNames array
param keyValueValues array

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2023-03-01' = {
  name: appConfigName
  location: location
  sku: {
    name: skuName
  }
}

// Adding AppConfiguration key values
resource appConfigKeyValues 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = [
  for (keyName, i) in keyValueNames: {
    parent: appConfig
    name: keyName
    properties: {
      value: keyValueValues[i]
    }
  }
]

output appConfigId string = appConfig.id
output appConfigEndpoint string = appConfig.properties.endpoint
output appConfigServiceName string = appConfig.name
