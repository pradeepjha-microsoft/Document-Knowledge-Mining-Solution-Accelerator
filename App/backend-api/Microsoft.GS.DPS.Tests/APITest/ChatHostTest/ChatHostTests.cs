using FluentAssertions;
using Microsoft.GS.DPS.API;
using Microsoft.GS.DPS.Model;
using Moq;

namespace Microsoft.GS.DPS.Tests.API.Services
{
    public class ChatHostTests
    {
        // The class we're testing        

        //private readonly ChatHost _chatService;
        //private readonly

        //public ChatHostTests()
        //{
        //    _chatService = new ChatHost("tt","fff","ff","dd");  // Directly instantiate ChatService
        //}

        //    [Fact]
        //    public async Task ChatAsync_ShouldReturnCorrectChatResponseAsync()
        //    {
        //        // Arrange: Create a sample chatRequest and simulate a ChatResponse
        //        var chatRequest = new ChatRequest(); // You can populate with actual properties if needed
        //        var mockChatResponse = new ChatResponse
        //        {
        //            ChatSessionId = "session-123",
        //            Answer = "Hello, how can I help you?",
        //            DocumentIds = new List<string> { "doc-1", "doc-2" },
        //            SuggestingQuestions = new List<string> { "What is your name?", "What can I help you with?" }
        //        };

        //        // Act: Call the method under test
        //        var result = await _chatService.ChatAsync(chatRequest);

        //        // Assert: Verify the expected values
        //        result.Should().NotBeNull();
        //        result.ChatSessionId.Should().Be(mockChatResponse.ChatSessionId);
        //        result.Answer.Should().Be(mockChatResponse.Answer);
        //        result.DocumentIds.Should().BeEquivalentTo(mockChatResponse.DocumentIds);
        //        result.SuggestingQuestions.Should().BeEquivalentTo(mockChatResponse.SuggestingQuestions);
        //        result.AnswerWords.Should().BeEquivalentTo(new List<string> { "Hello,", "how", "can", "I", "help", "you?" });
        //    }

        //    [Fact]
        //    public async Task ChatAsync_ShouldThrowException_WhenChatFails()
        //    {
        //        // Arrange: Simulate an error in Chat method by using a mock method or throwing an exception directly
        //        var chatRequest = new ChatRequest();  // Simulate the request

        //        // Act & Assert: Simulate an error and ensure the exception is thrown
        //        Func<Task> act = async () => await _chatService.ChatAsync(chatRequest);
        //        await act.Should().ThrowAsync<Exception>().WithMessage("Error during chat interaction");
        //    }
    }

}

