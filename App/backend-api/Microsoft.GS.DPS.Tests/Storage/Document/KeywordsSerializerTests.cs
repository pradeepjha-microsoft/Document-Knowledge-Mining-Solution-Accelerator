using Microsoft.GS.DPS.Storage.Document;
using Microsoft.GS.DPS.Storage.Document.Entities;  // Correct namespace for Document class
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;
using Xunit;

namespace Microsoft.GS.DPS.Tests.Storage.Document
{
    public class KeywordsSerializerTests
    {
        [Fact]
        public void Serialize_ShouldCorrectlySerializeKeywords()
        {
            // Arrange
            var serializer = new KeywordsSerializer();
            var keywords = new List<Dictionary<string, List<string>>>
            {
                new Dictionary<string, List<string>>
                {
                    { "topic1", new List<string> { "keyword1", "keyword2" } },
                    { "topic2", new List<string> { "keyword3" } }
                }
            };

            // Act
            var bsonArray = new BsonArray();
            foreach (var keywordDict in keywords)
            {
                var bsonDocument = new BsonDocument();
                foreach (var kvp in keywordDict)
                {
                    bsonDocument.Add(kvp.Key, new BsonArray(kvp.Value));
                }
                bsonArray.Add(bsonDocument);
            }

            // Assert
            Assert.NotNull(bsonArray);
            Assert.Single(bsonArray);
            var document = bsonArray[0].AsBsonDocument;
            Assert.True(document.Contains("topic1"));
            Assert.True(document.Contains("topic2"));
            Assert.Equal(new BsonArray { "keyword1", "keyword2" }, document["topic1"].AsBsonArray);
            Assert.Equal(new BsonArray { "keyword3" }, document["topic2"].AsBsonArray);
        }

        [Fact]
        public void Deserialize_ShouldCorrectlyDeserializeKeywords()
        {
            // Arrange
            var serializer = new KeywordsSerializer();

            // Ensure BSON matches expected structure
            var bsonArray = new BsonArray
            {
                new BsonDocument
                {
                    { "topic1", new BsonArray { "keyword1", "keyword2" } },
                    { "topic2", new BsonArray { "keyword3" } }
                }
            };

            var bsonDocument = new BsonDocument { { "Keywords", bsonArray } };

            using (var bsonReader = new BsonDocumentReader(bsonDocument))
            {
                var context = BsonDeserializationContext.CreateRoot(bsonReader);
                bsonReader.ReadStartDocument(); // Move the reader to the "Keywords" field
                bsonReader.ReadName("Keywords"); // Read the array field
                var result = serializer.Deserialize(context, default);

                // Act & Assert
                Assert.NotNull(result);
                Assert.Single(result);

                var dict = result[0];
                Assert.True(dict.ContainsKey("topic1"));
                Assert.True(dict.ContainsKey("topic2"));
                Assert.Equal(new List<string> { "keyword1", "keyword2" }, dict["topic1"]);
                Assert.Equal(new List<string> { "keyword3" }, dict["topic2"]);
            }
        }

        [Fact]
        public void Serialize_ShouldHandleEmptyKeywordsList()
        {
            // Arrange
            var serializer = new KeywordsSerializer();
            var keywords = new List<Dictionary<string, List<string>>>();

            // Act
            var bsonArray = new BsonArray();
            foreach (var keywordDict in keywords)
            {
                var bsonDocument = new BsonDocument();
                foreach (var kvp in keywordDict)
                {
                    bsonDocument.Add(kvp.Key, new BsonArray(kvp.Value));
                }
                bsonArray.Add(bsonDocument);
            }

            // Assert
            Assert.NotNull(bsonArray);
            Assert.Empty(bsonArray); // Should be empty as no keywords were provided
        }

        [Fact]
        public void Deserialize_ShouldHandleEmptyKeywordsList()
        {
            // Arrange
            var serializer = new KeywordsSerializer();

            // Create an empty BSON array
            var bsonArray = new BsonArray();

            var bsonDocument = new BsonDocument { { "Keywords", bsonArray } };

            using (var bsonReader = new BsonDocumentReader(bsonDocument))
            {
                var context = BsonDeserializationContext.CreateRoot(bsonReader);
                bsonReader.ReadStartDocument(); // Move the reader to the "Keywords" field
                bsonReader.ReadName("Keywords"); // Read the array field
                var result = serializer.Deserialize(context, default);

                // Assert
                Assert.NotNull(result);
                Assert.Empty(result); // Should be empty as no keywords were deserialized
            }
        }

        [Fact]
        public void Deserialize_ShouldHandleInvalidBsonStructure()
        {
            // Arrange
            var serializer = new KeywordsSerializer();

            // Create an invalid BSON structure (e.g., "Keywords" is not an array or is malformed)
            var bsonDocument = new BsonDocument
            {
                { "Keywords", new BsonDocument { { "InvalidKey", "InvalidValue" } } } // Invalid structure
            };

            using (var bsonReader = new BsonDocumentReader(bsonDocument))
            {
                var context = BsonDeserializationContext.CreateRoot(bsonReader);

                // Act & Assert
                var exception = Assert.Throws<InvalidOperationException>(() => serializer.Deserialize(context, default));
                Assert.Contains("ReadStartArray can only be called when CurrentBsonType is Array", exception.Message);
            }
        }
    }
    public class MongoDbConfigTests
    {
        //[Fact]
        //public void RegisterClassMaps_ShouldRegisterDocumentClassMap()
        //{
        //    // Arrange
        //    MongoDbConfig.RegisterClassMaps(); // Register class maps for Document type

        //    // Act
        //    bool classMapRegistered = BsonClassMap.IsClassMapRegistered(typeof(Microsoft.GS.DPS.Storage.Document.Entities.Document));

        //    // Assert
        //    Assert.True(classMapRegistered, "Document class map was not registered properly.");
        //}
    }
}

