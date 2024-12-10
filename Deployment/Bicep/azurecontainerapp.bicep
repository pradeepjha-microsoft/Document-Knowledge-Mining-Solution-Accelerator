param containerappName string
param environmentid string
param containerimagename string
param containerimagetag string
param isIngress bool = false
param targetPort int = 80
param cpuresource int = 2
param memoryresource string = '4.0Gi'
param envvars array = []

resource containerapp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerappName
  location: resourceGroup().location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: environmentid
    configuration: {
      ingress: {
        external: isIngress
        targetPort: targetPort
      }
    }
    template: {
      containers: [
        {
          name: containerimagename
          image: containerimagetag
          resources: { cpu: cpuresource, memory: memoryresource }
          env: envvars
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 1 }
    }
  }
}

output managedIdentityPrincipalId string = containerapp.identity.principalId
output fqdn string = containerapp.properties.configuration.ingress.fqdn
