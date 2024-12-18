using Microsoft.GS.DPS.Storage.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.Storage.Document
{
    public class QueryResultSetTest
    {
        [Fact]
        public void QueryResultSet_ShouldInitializeProperties()
        {
            // Arrange & Act
            var queryResultSet = new QueryResultSet();

            // Assert
            Assert.Null(queryResultSet.Results); // Default value for a property of type IEnumerable<T>
            Assert.Equal(0, queryResultSet.TotalPages); // Default value for int
            Assert.Equal(0, queryResultSet.TotalRecords); // Default value for int
            Assert.Equal(0, queryResultSet.CurrentPage); // Default value for int
        }

        [Fact]
        public void QueryResultSet_ShouldAllowPropertyAssignment()
        {
            // Arrange
            var documents = new List<DPS.Storage.Document.Entities.Document>
            {
                new DPS.Storage.Document.Entities.Document { DocumentId = "1", FileName = "Test Document 1" },
                new DPS.Storage.Document.Entities.Document { DocumentId = "2", FileName = "Test Document 2" }
            };

            var expectedTotalPages = 5;
            var expectedTotalRecords = 50;
            var expectedCurrentPage = 2;

            // Act
            var queryResultSet = new QueryResultSet
            {
                Results = documents,
                TotalPages = expectedTotalPages,
                TotalRecords = expectedTotalRecords,
                CurrentPage = expectedCurrentPage
            };

            // Assert
            Assert.Equal(documents, queryResultSet.Results);
            Assert.Equal(expectedTotalPages, queryResultSet.TotalPages);
            Assert.Equal(expectedTotalRecords, queryResultSet.TotalRecords);
            Assert.Equal(expectedCurrentPage, queryResultSet.CurrentPage);
        }

        [Fact]
        public void QueryResultSet_ShouldHandleEmptyResults()
        {
            // Arrange
            var emptyResults = new List<DPS.Storage.Document.Entities.Document>();

            // Act
            var queryResultSet = new QueryResultSet
            {
                Results = emptyResults,
                TotalPages = 0,
                TotalRecords = 0,
                CurrentPage = 0
            };

            // Assert
            Assert.Empty(queryResultSet.Results); // Ensure Results is empty
            Assert.Equal(0, queryResultSet.TotalPages);
            Assert.Equal(0, queryResultSet.TotalRecords);
            Assert.Equal(0, queryResultSet.CurrentPage);
        }
    }
}
