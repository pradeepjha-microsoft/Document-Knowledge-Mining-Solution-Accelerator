@description('The ID of the principal (user, group, or service principal) to assign the role to')
param principalId string

@description('The name of the Storage Queue')
param storageAccount string

resource storageAccountResource 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccount
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(resourceGroup().id, 'Storage Queue Data Contributor', principalId)
  scope: storageAccountResource
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
    )
    principalId: principalId
  }
}

output roleAssignmentId string = roleAssignment.id
