using Microsoft.GS.DPS.Storage.ChatSessions.Entities;
using Microsoft.GS.DPS.Storage.Document;
using Microsoft.GS.DPS.Storage.Components;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.Storage.ChatSessions
{
    public class ChatSessionRepositoryTests
    {
        private readonly Mock<IMongoCollection<ChatSession>> _mockCollection;
        private readonly Mock<IMongoDatabase> _mockDatabase;
        private readonly DPS.Storage.ChatSessions.ChatSessionRepository _repository;

        public ChatSessionRepositoryTests()
        {
            _mockCollection = new Mock<IMongoCollection<ChatSession>>();
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockDatabase.Setup(db => db.GetCollection<ChatSession>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                         .Returns(_mockCollection.Object);

            _repository = new DPS.Storage.ChatSessions.ChatSessionRepository(_mockDatabase.Object, "TestChatSessions");
        }

        [Fact]
        public async Task RegisterSessionAsync_ShouldInsertSession_WhenValidSession()
        {
            // Arrange
            var chatSession = new ChatSession
            {
                SessionId = "123",
                // Add other properties as needed
            };

            // Act
            await _repository.RegisterSessionAsync(chatSession);

            // Assert
            _mockCollection.Verify(m => m.InsertOneAsync(It.IsAny<ChatSession>(), null, default), Times.Once);
        }
        
    }
}

