using Microsoft.GS.DPS.Model.ChatHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.ChatHost
{
    public class ChatResponseAsyncTests
    {
        [Fact]
        public void ChatResponseAsync_SetAndGetProperties_ShouldWork()
        {
            // Arrange
            var chatResponseAsync = new ChatResponseAsync
            {
                ChatSessionId = "asyncSession123",
                Answer = "This is an asynchronous answer.",
                DocumentIds = new[] { "doc3", "doc4" },
                SuggestingQuestions = new[] { "What is a chatbot?", "What are its uses?" },
                Keywords = new[] { "chatbot", "AI" }
            };

            // Act & Assert
            Assert.Equal("asyncSession123", chatResponseAsync.ChatSessionId);
            Assert.Equal("This is an asynchronous answer.", chatResponseAsync.Answer);
            Assert.Equal(2, chatResponseAsync.DocumentIds.Length);
            Assert.Equal("doc3", chatResponseAsync.DocumentIds[0]);
            Assert.Equal("doc4", chatResponseAsync.DocumentIds[1]);
            Assert.Equal(2, chatResponseAsync.SuggestingQuestions.Length);
            Assert.Equal("What is a chatbot?", chatResponseAsync.SuggestingQuestions[0]);
            Assert.Equal("What are its uses?", chatResponseAsync.SuggestingQuestions[1]);
            Assert.Equal(2, chatResponseAsync.Keywords.Length);
            Assert.Equal("chatbot", chatResponseAsync.Keywords[0]);
            Assert.Equal("AI", chatResponseAsync.Keywords[1]);
        }
    }
}
