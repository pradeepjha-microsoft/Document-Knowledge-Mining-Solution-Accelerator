using Microsoft.GS.DPS.Storage.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.Storage.Component
{
    public class CosmosDBEntityBaseTests
    {
        [Fact]
        public void ShouldGenerateValidGuid()
        {
            // Arrange
            var entity = new CosmosDBEntityBase();

            // Act
            var id = entity.id;

            // Assert
            Assert.True(Guid.TryParse(id.ToString(), out _), "ID is not a valid GUID");
        }

        [Fact]
        public void ShouldGenerateValidPartitionKey()
        {
            // Arrange
            var entity = new CosmosDBEntityBase();

            // Act
            var partitionKey = entity.__partitionkey;

            // Assert
            Assert.NotNull(partitionKey);
            Assert.Matches(@"^\d{4}$", partitionKey); // Partition key padded to 4 digits for 9999 partitions
        }

        [Fact]
        public void PartitionKeyGenerationShouldBeDeterministic()
        {
            // Arrange
            var id = Guid.Parse("550e8400-e29b-41d4-a716-446655440000");

            // Act
            var key1 = CosmosDBEntityBase.GetKey(id, 9999);
            var key2 = CosmosDBEntityBase.GetKey(id, 9999);

            // Assert
            Assert.Equal(key1, key2);
        }

        [Fact]
        public void PartitionKeyShouldChangeWithDifferentNumberOfPartitions()
        {
            // Arrange
            var id = Guid.Parse("550e8400-e29b-41d4-a716-446655440000");

            // Act
            var key1 = CosmosDBEntityBase.GetKey(id, 100);
            var key2 = CosmosDBEntityBase.GetKey(id, 9999);

            // Assert
            Assert.NotEqual(key1, key2);
        }
    }
}
