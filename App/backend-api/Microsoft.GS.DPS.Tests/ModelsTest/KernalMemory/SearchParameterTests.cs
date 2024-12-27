using Microsoft.GS.DPS.Model.KernelMemory;
using Microsoft.KernelMemory.Context;
using Microsoft.KernelMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.KernalMemory
{

    public class SearchParameterTests
    {
        [Fact]
        public void Constructor_ShouldInitializeDefaultValues()
        {
            // Arrange & Act
            var searchParameter = new SearchParameter();

            // Assert
            Assert.Equal(string.Empty, searchParameter.query);
            Assert.Null(searchParameter.MemoryFilter);
            Assert.Null(searchParameter.MemoryFilters);
            Assert.Equal(0.0, searchParameter.minRelevance);
            Assert.Equal(-1, searchParameter.limit);
            Assert.Null(searchParameter.Context);
        }

        [Fact]
        public void Properties_ShouldSetAndGetValues()
        {
            // Arrange
            var searchParameter = new SearchParameter();
            var memoryFilter = new MemoryFilter();
            var memoryFilters = new List<MemoryFilter> { memoryFilter };
            var contextMock = new Moq.Mock<IContext>();

            // Act
            searchParameter.query = "test query";
            searchParameter.MemoryFilter = memoryFilter;
            searchParameter.MemoryFilters = memoryFilters;
            searchParameter.minRelevance = 0.75;
            searchParameter.limit = 10;
            searchParameter.Context = contextMock.Object;

            // Assert
            Assert.Equal("test query", searchParameter.query);
            Assert.Equal(memoryFilter, searchParameter.MemoryFilter);
            Assert.Equal(memoryFilters, searchParameter.MemoryFilters);
            Assert.Equal(0.75, searchParameter.minRelevance);
            Assert.Equal(10, searchParameter.limit);
            Assert.Equal(contextMock.Object, searchParameter.Context);
        }

        [Fact]
        public void MemoryFilters_ShouldHandleNullAndNonNullValues()
        {
            // Arrange
            var searchParameter = new SearchParameter();

            // Act
            searchParameter.MemoryFilters = null;

            // Assert
            Assert.Null(searchParameter.MemoryFilters);

            // Act
            var memoryFilters = new List<MemoryFilter> { new MemoryFilter() };
            searchParameter.MemoryFilters = memoryFilters;

            // Assert
            Assert.NotNull(searchParameter.MemoryFilters);
            Assert.Single(searchParameter.MemoryFilters);
        }

        [Fact]
        public void Limit_ShouldAcceptNegativeValuesAsDefaults()
        {
            // Arrange
            var searchParameter = new SearchParameter();

            // Act
            searchParameter.limit = -1;

            // Assert
            Assert.Equal(-1, searchParameter.limit);
        }
    }
}
