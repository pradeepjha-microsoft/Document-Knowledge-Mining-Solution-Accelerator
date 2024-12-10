@description('The name of the Log Analytics workspace')
param workspaceName string

@description('The location where the Log Analytics workspace will be created')
param location string

@description('The pricing tier for the Log Analytics workspace')
param pricingTier string = 'PerGB2018'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: pricingTier
    }
    retentionInDays: 30
  }
}

output workspaceId string = logAnalyticsWorkspace.id
output workspaceName string = logAnalyticsWorkspace.name
