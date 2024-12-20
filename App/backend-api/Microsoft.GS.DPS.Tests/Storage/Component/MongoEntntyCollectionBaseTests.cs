using System;
using Xunit;
using MongoDB.Driver;
using Microsoft.GS.DPS.Storage.Components;

namespace Microsoft.GS.DPS.Tests.Storage.Component
{
    public class MongoEntntyCollectionBaseTests
    {
        [Fact]
        public void Constructor_ValidInputs_ShouldInitializeEntityCollection()
        {
            // Arrange
            string validConnectionString = "mongodb://localhost:27017";
            string collectionName = "TestCollection";

            // Act
            var repository = new MongoEntntyCollectionBase<TestEntity, string>(validConnectionString, collectionName);

            // Assert
            Assert.NotNull(repository.EntityCollection);
            Assert.IsType<BusinessTransactionRepository<TestEntity, string>>(repository.EntityCollection);
        }
        [Fact]
        public void Constructor_InvalidConnectionString_ShouldThrowMongoConfigurationException()
        {
            // Arrange
            string invalidConnectionString = "invalid_connection_string";
            string collectionName = "TestCollection";

            // Act & Assert
            var exception = Assert.Throws<MongoConfigurationException>(() =>
            {
                var repository = new MongoEntntyCollectionBase<TestEntity, string>(invalidConnectionString, collectionName);

                // Force interaction with the MongoDB client to validate the connection string
                var client = CosmosMongoClientManager.Instance;
                client.ListDatabaseNames(); // This triggers connection string validation
            });

            Assert.NotNull(exception);
        }


        [Fact]
        public void CosmosMongoClientManager_Instance_ShouldBeSingleton()
        {
            // Arrange
            CosmosMongoClientManager.DataconnectionString = "mongodb://localhost:27017";

            // Act
            var client1 = CosmosMongoClientManager.Instance;
            var client2 = CosmosMongoClientManager.Instance;

            // Assert
            Assert.NotNull(client1);
            Assert.Same(client1, client2); // Ensure singleton
        }
    }

    // Mock entity implementing IEntityModel for testing
    public class TestEntity : IEntityModel<string>
    {
        public string Id { get; set; }
        string IEntityModel<string>.id { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        string IEntityModel<string>.__partitionkey { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }
}
