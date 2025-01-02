using Microsoft.GS.DPS.Model.KernelMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.KernalMemory
{
        public class DocumentImportedResultTests
        {
            [Fact]
            public void Constructor_ShouldInitializeProperties()
            {
                // Arrange
                var importedTime = DateTime.UtcNow;
                var processingTime = TimeSpan.FromMinutes(2);
                var keywords = new Dictionary<string, string> { { "Author", "John Doe" } };

                // Act
                var documentImportedResult = new DocumentImportedResult
                {
                    DocumentId = "12345",
                    ImportedTime = importedTime,
                    FileName = "example.pdf",
                    ProcessingTime = processingTime,
                    MimeType = "application/pdf",
                    Keywords = keywords,
                    Summary = "This is a summary."
                };

                // Assert
                Assert.Equal("12345", documentImportedResult.DocumentId);
                Assert.Equal(importedTime, documentImportedResult.ImportedTime);
                Assert.Equal("example.pdf", documentImportedResult.FileName);
                Assert.Equal(processingTime, documentImportedResult.ProcessingTime);
                Assert.Equal("application/pdf", documentImportedResult.MimeType);
                Assert.Equal(keywords, documentImportedResult.Keywords);
                Assert.Equal("This is a summary.", documentImportedResult.Summary);
            }

            [Fact]
            public void Keywords_ShouldHandleNullAndNonNullValues()
            {
                // Arrange
                var documentImportedResult = new DocumentImportedResult();

                // Act & Assert for null
                documentImportedResult.Keywords = null;
                Assert.Null(documentImportedResult.Keywords);

                // Act & Assert for non-null
                var keywords = new Dictionary<string, string> { { "Key1", "Value1" } };
                documentImportedResult.Keywords = keywords;

                Assert.NotNull(documentImportedResult.Keywords);
                Assert.Single(documentImportedResult.Keywords);
                Assert.Equal("Value1", documentImportedResult.Keywords["Key1"]);
            }

            [Fact]
            public void ProcessingTime_ShouldAcceptValidTimeSpans()
            {
                // Arrange
                var documentImportedResult = new DocumentImportedResult();
                var processingTime = TimeSpan.FromHours(1);

                // Act
                documentImportedResult.ProcessingTime = processingTime;

                // Assert
                Assert.Equal(processingTime, documentImportedResult.ProcessingTime);
            }

            [Fact]
            public void Summary_ShouldAcceptValidStrings()
            {
                // Arrange
                var documentImportedResult = new DocumentImportedResult();
                var summary = "Test summary.";

                // Act
                documentImportedResult.Summary = summary;

                // Assert
                Assert.Equal(summary, documentImportedResult.Summary);
            }

            [Fact]
            public void DefaultValues_ShouldBeInitializedCorrectly()
            {
                // Arrange & Act
                var documentImportedResult = new DocumentImportedResult();

                // Assert default values
                Assert.Null(documentImportedResult.DocumentId);
                Assert.Equal(default, documentImportedResult.ImportedTime);
                Assert.Null(documentImportedResult.FileName);
                Assert.Equal(default, documentImportedResult.ProcessingTime);
                Assert.Null(documentImportedResult.MimeType);
                Assert.Null(documentImportedResult.Keywords);
                Assert.Null(documentImportedResult.Summary);
            }
        }


}
