@description('The ID of the principal (user, group, or service principal) to assign the role to')
param principalId string

@description('The name of the App Configuration service')
param appConfigName string

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2024-05-01' existing = {
  name: appConfigName
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(resourceGroup().id, 'App Configuration Data Reader', principalId)
  scope: appConfig
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '516239f1-63e1-4d78-a4de-a74fb236a071'
    )
    principalId: principalId
  }
}

output roleAssignmentId string = roleAssignment.id
