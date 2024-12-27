using FluentValidation.TestHelper;
using Microsoft.GS.DPS.Model.ChatHost;
using Xunit;

namespace Microsoft.GS.DPS.Tests.ModelsTest.ChatHost
{
    public class ChatRequestTest
    {
        private readonly ChatRequestValidator _validator;

        public ChatRequestTest()
        {
            _validator = new ChatRequestValidator();
        }

        [Fact]
        public void Should_Have_Error_When_Question_Is_Null()
        {
            // Arrange
            var request = new ChatRequest { Question = null };

            // Act
            var result = _validator.TestValidate(request);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Question)
                .WithErrorMessage("'Question' must not be empty.");
        }

        [Fact]
        public void Should_Have_Error_When_Question_Is_Empty()
        {
            // Arrange
            var request = new ChatRequest { Question = string.Empty };

            // Act
            var result = _validator.TestValidate(request);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Question)
                .WithErrorMessage("'Question' must not be empty.");
        }

        [Fact]
        public void Should_Not_Have_Error_When_Question_Is_Valid()
        {
            // Arrange
            var request = new ChatRequest { Question = "What is your name?" };

            // Act
            var result = _validator.TestValidate(request);

            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.Question);
        }

        [Fact]
        public void Should_Not_Have_Error_When_ChatSessionId_Is_Valid()
        {
            // Arrange
            var request = new ChatRequest { Question = "What is the time?", ChatSessionId = "session123" };

            // Act
            var result = _validator.TestValidate(request);

            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.ChatSessionId);
        }

        [Fact]
        public void Should_Not_Have_Error_When_DocumentIds_Is_Valid()
        {
            // Arrange
            var request = new ChatRequest
            {
                Question = "What is the time?",
                DocumentIds = new string[5] // Valid length (less than 10)
            };

            // Act
            var result = _validator.TestValidate(request);

            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.DocumentIds);
        }
    }
}

