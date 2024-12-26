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


    }
}
