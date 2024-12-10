@description('The ID of the principal (user, group, or service principal) to assign the role to')
param principalId string

@description('The name of the Storage Blob')
param storageBlobName string

resource storageblob 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageBlobName
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(resourceGroup().id, 'Storage Blob Data Contributor', principalId)
  scope: storageblob
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
    )
    principalId: principalId
  }
}

output roleAssignmentId string = roleAssignment.id
