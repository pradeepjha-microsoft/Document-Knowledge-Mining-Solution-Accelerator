using Microsoft.GS.DPS.Storage.Components;
using System;
using System.Linq;
using System.Linq.Expressions;
using Xunit;

namespace Microsoft.GS.DPS.Tests.Storage.Component
{
    public class GenericSpecificationTests
    {
        // Test the constructor for initializing Predicate, OrderBy, and Order properties
        [Fact]
        public void Constructor_ShouldInitializePropertiesCorrectly()
        {
            // Arrange
            Expression<Func<TestEntityForSpecification, bool>> predicate = e => e.Id > 5;
            Expression<Func<TestEntityForSpecification, dynamic>> orderBy = e => e.Name;

            // Act
            var specification = new GenericSpecification<TestEntityForSpecification>(predicate, orderBy, Order.Desc);

            // Assert
            Assert.NotNull(specification.Predicate);
            Assert.NotNull(specification.OrderBy);
            Assert.Equal(Order.Desc, specification.Order);
            Assert.Equal(predicate, specification.Predicate);
            Assert.Equal(orderBy, specification.OrderBy);
        }

        // Test Predicate filtering logic
        [Fact]
        public void Predicate_ShouldFilterEntitiesCorrectly()
        {
            // Arrange
            Expression<Func<TestEntityForSpecification, bool>> predicate = e => e.Id > 5;
            var specification = new GenericSpecification<TestEntityForSpecification>(predicate);

            var entities = new[]
            {
                new TestEntityForSpecification { Id = 4, Name = "Entity1" },
                new TestEntityForSpecification { Id = 6, Name = "Entity2" },
                new TestEntityForSpecification { Id = 8, Name = "Entity3" }
            };

            // Act
            var filteredEntities = entities.AsQueryable().Where(specification.Predicate).ToList();

            // Assert
            Assert.Equal(2, filteredEntities.Count);
            Assert.Contains(filteredEntities, e => e.Id == 6);
            Assert.Contains(filteredEntities, e => e.Id == 8);
        }

        // Test sorting by OrderBy with Order.Asc (ascending order)
        [Fact]
        public void OrderBy_ShouldReturnCorrectOrder_Asc()
        {
            // Arrange
            Expression<Func<TestEntityForSpecification, dynamic>> orderBy = e => e.Name;
            var specification = new GenericSpecification<TestEntityForSpecification>(e => e.Id > 0, orderBy, Order.Asc);

            var entities = new[]
            {
                new TestEntityForSpecification { Id = 1, Name = "Charlie" },
                new TestEntityForSpecification { Id = 2, Name = "Alice" },
                new TestEntityForSpecification { Id = 3, Name = "Bob" }
            };

            // Act
            var orderedEntities = entities.AsQueryable()
                .OrderBy(specification.OrderBy)  // Ascending order
                .ToList();

            // Assert
            Assert.Equal("Alice", orderedEntities[0].Name);
            Assert.Equal("Bob", orderedEntities[1].Name);
            Assert.Equal("Charlie", orderedEntities[2].Name);
        }

        // Test sorting by OrderBy with Order.Desc (descending order)
        [Fact]
        public void OrderBy_ShouldReturnCorrectOrder_Desc()
        {
            // Arrange
            Expression<Func<TestEntityForSpecification, dynamic>> orderBy = e => e.Name;
            var specification = new GenericSpecification<TestEntityForSpecification>(e => e.Id > 0, orderBy, Order.Desc);

            var entities = new[]
            {
                new TestEntityForSpecification { Id = 1, Name = "Charlie" },
                new TestEntityForSpecification { Id = 2, Name = "Alice" },
                new TestEntityForSpecification { Id = 3, Name = "Bob" }
            };

            // Act
            var orderedEntities = entities.AsQueryable()
                .OrderByDescending(specification.OrderBy)  // Descending order
                .ToList();

            // Assert
            Assert.Equal("Charlie", orderedEntities[0].Name);
            Assert.Equal("Bob", orderedEntities[1].Name);
            Assert.Equal("Alice", orderedEntities[2].Name);
        }
    }

    // Renamed test entity to avoid conflicts
    public class TestEntityForSpecification
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
