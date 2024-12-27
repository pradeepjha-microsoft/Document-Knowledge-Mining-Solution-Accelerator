using Microsoft.GS.DPS.Model.ChatHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.ChatHost
{
    public class ChatResponseTests
    {
        [Fact]
        public void ChatResponse_SetAndGetProperties_ShouldWork()
        {
            // Arrange
            var chatResponse = new ChatResponse
            {
                ChatSessionId = "session123",
                Answer = "This is a sample answer.",
                DocumentIds = new[] { "doc1", "doc2" },
                SuggestingQuestions = new[] { "What is AI?", "How does it work?" },
                Keywords = new[] { "AI", "Technology" }
            };

            // Act & Assert
            Assert.Equal("session123", chatResponse.ChatSessionId);
            Assert.Equal("This is a sample answer.", chatResponse.Answer);
            Assert.Equal(2, chatResponse.DocumentIds.Length);
            Assert.Equal("doc1", chatResponse.DocumentIds[0]);
            Assert.Equal("doc2", chatResponse.DocumentIds[1]);
            Assert.Equal(2, chatResponse.SuggestingQuestions.Length);
            Assert.Equal("What is AI?", chatResponse.SuggestingQuestions[0]);
            Assert.Equal("How does it work?", chatResponse.SuggestingQuestions[1]);
            Assert.Equal(2, chatResponse.Keywords.Length);
            Assert.Equal("AI", chatResponse.Keywords[0]);
            Assert.Equal("Technology", chatResponse.Keywords[1]);
        }
    }
}
