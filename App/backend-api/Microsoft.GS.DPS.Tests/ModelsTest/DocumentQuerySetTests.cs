using Xunit;
using Microsoft.GS.DPS.Model.UserInterface;
using Microsoft.GS.DPS.Storage.Document.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.GS.DPS.Tests.ModelsTest
{
    public class DocumentQuerySetTests
    {
        [Fact]
        public void DocumentQuerySet_Should_Have_Documents_Collection()
        {
            // Arrange
            var documents = new List<Document>
            {
                new Document { /* initialize with some properties */ },
                new Document { /* initialize with some properties */ }
            };

            var querySet = new DocumentQuerySet
            {
                documents = documents,
                keywordFilterInfo = new Dictionary<string, List<string>>(),
                TotalPages = 1,
                TotalRecords = 2,
                CurrentPage = 1
            };

            // Act
            var result = querySet.documents;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public void DocumentQuerySet_Should_Have_KeywordFilterInfo()
        {
            // Arrange
            var querySet = new DocumentQuerySet
            {
                documents = new List<Document>(),
                keywordFilterInfo = new Dictionary<string, List<string>>
                {
                    { "Category", new List<string> { "Science", "Technology" } },
                    { "Author", new List<string> { "John Doe", "Jane Smith" } }
                },
                TotalPages = 1,
                TotalRecords = 2,
                CurrentPage = 1
            };

            // Act
            var result = querySet.keywordFilterInfo;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains("Category", result.Keys);
            Assert.Contains("Science", result["Category"]);
        }

        [Fact]
        public void DocumentQuerySet_Should_Have_TotalPages_And_Records()
        {
            // Arrange
            var querySet = new DocumentQuerySet
            {
                documents = new List<Document>(),
                keywordFilterInfo = new Dictionary<string, List<string>>(),
                TotalPages = 5,
                TotalRecords = 50,
                CurrentPage = 1
            };

            // Act
            var totalPages = querySet.TotalPages;
            var totalRecords = querySet.TotalRecords;

            // Assert
            Assert.Equal(5, totalPages);
            Assert.Equal(50, totalRecords);
        }

        [Fact]
        public void DocumentQuerySet_Should_Have_CurrentPage()
        {
            // Arrange
            var querySet = new DocumentQuerySet
            {
                documents = new List<Document>(),
                keywordFilterInfo = new Dictionary<string, List<string>>(),
                TotalPages = 5,
                TotalRecords = 50,
                CurrentPage = 3
            };

            // Act
            var currentPage = querySet.CurrentPage;

            // Assert
            Assert.Equal(3, currentPage);
        }

        [Fact]
        public void DocumentQuerySet_Should_Handle_Empty_DocumentList()
        {
            // Arrange
            var querySet = new DocumentQuerySet
            {
                documents = new List<Document>(),
                keywordFilterInfo = new Dictionary<string, List<string>>(),
                TotalPages = 0,
                TotalRecords = 0,
                CurrentPage = 1
            };

            // Act
            var result = querySet.documents;

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void DocumentQuerySet_Should_Handle_No_KeywordFilters()
        {
            // Arrange
            var querySet = new DocumentQuerySet
            {
                documents = new List<Document>(),
                keywordFilterInfo = new Dictionary<string, List<string>>(),
                TotalPages = 1,
                TotalRecords = 2,
                CurrentPage = 1
            };

            // Act
            var result = querySet.keywordFilterInfo;

            // Assert
            Assert.Empty(result);
        }
    }
   
}
