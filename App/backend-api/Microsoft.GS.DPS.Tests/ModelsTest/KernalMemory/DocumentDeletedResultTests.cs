using Microsoft.GS.DPS.Model.KernelMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.KernalMemory
{
    public class DocumentDeletedResultTests
    {
        [Fact]
        public void IsDeleted_ShouldReturnCorrectValue()
        {
            // Arrange
            var documentDeletedResult = new DocumentDeletedResult();

            // Act
            documentDeletedResult.IsDeleted = true;

            // Assert
            Assert.True(documentDeletedResult.IsDeleted);

            // Act
            documentDeletedResult.IsDeleted = false;

            // Assert
            Assert.False(documentDeletedResult.IsDeleted);
        }
    }
}
