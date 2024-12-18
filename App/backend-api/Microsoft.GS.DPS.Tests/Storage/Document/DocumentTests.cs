using Microsoft.GS.DPS.Storage.Document.Entities;
using System;
using System.Collections.Generic;
using Xunit;

namespace Microsoft.GS.DPS.Tests.Storage.Document.Entities
{
    public class DocumentTests
    {
        [Fact]
        public void Document_ShouldInitializeWithDefaultValues()
        {
            // Arrange & Act
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();

            // Assert
            Assert.Null(document.DocumentId);
            Assert.Null(document.FileName);
            Assert.Null(document.Keywords);
            Assert.Equal(default(DateTime), document.ImportedTime);
            Assert.Equal(default(TimeSpan), document.ProcessingTime);
            Assert.Null(document.MimeType);
            Assert.Null(document.Summary);
        }

        [Fact]
        public void Document_ShouldSetAndGetProperties()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var documentId = "12345";
            var fileName = "example.pdf";
            var keywords = new Dictionary<string, string>
            {
                { "Topic", "Science" },
                { "Category", "Physics" }
            };
            var importedTime = DateTime.UtcNow;
            var processingTime = TimeSpan.FromSeconds(120);
            var mimeType = "application/pdf";
            var summary = "This is a summary of the document.";

            // Act
            document.DocumentId = documentId;
            document.FileName = fileName;
            document.Keywords = keywords;
            document.ImportedTime = importedTime;
            document.ProcessingTime = processingTime;
            document.MimeType = mimeType;
            document.Summary = summary;

            // Assert
            Assert.Equal(documentId, document.DocumentId);
            Assert.Equal(fileName, document.FileName);
            Assert.Equal(keywords, document.Keywords);
            Assert.Equal(importedTime, document.ImportedTime);
            Assert.Equal(processingTime, document.ProcessingTime);
            Assert.Equal(mimeType, document.MimeType);
            Assert.Equal(summary, document.Summary);
        }

        [Fact]
        public void Document_KeywordsCanHandleEmptyDictionary()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var keywords = new Dictionary<string, string>();

            // Act
            document.Keywords = keywords;

            // Assert
            Assert.NotNull(document.Keywords);
            Assert.Empty(document.Keywords);
        }

        [Fact]
        public void Document_ImportedTime_ShouldSetCorrectValue()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var importedTime = new DateTime(2024, 5, 1, 12, 0, 0);

            // Act
            document.ImportedTime = importedTime;

            // Assert
            Assert.Equal(importedTime, document.ImportedTime);
        }

        [Fact]
        public void Document_ProcessingTime_ShouldSetCorrectValue()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var processingTime = TimeSpan.FromMinutes(5);

            // Act
            document.ProcessingTime = processingTime;

            // Assert
            Assert.Equal(processingTime, document.ProcessingTime);
        }

        [Fact]
        public void Document_HandlesNullValuesInKeywords()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();

            // Act
            document.Keywords = null;

            // Assert
            Assert.Null(document.Keywords);
        }

        [Fact]
        public void Document_FileName_ShouldSetAndReturnCorrectValue()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var fileName = "testfile.docx";

            // Act
            document.FileName = fileName;

            // Assert
            Assert.Equal(fileName, document.FileName);
        }

        [Fact]
        public void Document_MimeType_ShouldSetAndReturnCorrectValue()
        {
            // Arrange
            var document = new Microsoft.GS.DPS.Storage.Document.Entities.Document();
            var mimeType = "text/plain";

            // Act
            document.MimeType = mimeType;

            // Assert
            Assert.Equal(mimeType, document.MimeType);
        }
    }
}
