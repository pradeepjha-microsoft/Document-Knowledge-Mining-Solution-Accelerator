using Microsoft.GS.DPS.Model.ChatHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.ChatHost
{

    public class AnswerTests
    {
        [Fact]
        public void Test_Response_Property_Setter_Getter()
        {
            // Arrange
            var answer = new Answer();
            string expectedResponse = "This is a response.";

            // Act
            answer.Response = expectedResponse;

            // Assert
            Assert.Equal(expectedResponse, answer.Response);
        }

        [Fact]
        public void Test_Followings_Property_Setter_Getter()
        {
            // Arrange
            var answer = new Answer();
            string[] expectedFollowings = new string[] { "Followup1", "Followup2" };

            // Act
            answer.Followings = expectedFollowings;

            // Assert
            Assert.Equal(expectedFollowings, answer.Followings);
        }

        [Fact]
        public void Test_Keywords_Property_Setter_Getter()
        {
            // Arrange
            var answer = new Answer();
            string[] expectedKeywords = new string[] { "Keyword1", "Keyword2" };

            // Act
            answer.Keywords = expectedKeywords;

            // Assert
            Assert.Equal(expectedKeywords, answer.Keywords);
        }

        [Fact]
        public void Test_Followings_Empty_Array()
        {
            // Arrange
            var answer = new Answer();

            // Act
            answer.Followings = new string[] { };

            // Assert
            Assert.Empty(answer.Followings);
        }

        [Fact]
        public void Test_Keywords_Empty_Array()
        {
            // Arrange
            var answer = new Answer();

            // Act
            answer.Keywords = new string[] { };

            // Assert
            Assert.Empty(answer.Keywords);
        }

        [Fact]
        public void Test_Null_Followings_Property()
        {
            // Arrange
            var answer = new Answer();

            // Act
            answer.Followings = null;

            // Assert
            Assert.Null(answer.Followings);
        }

        [Fact]
        public void Test_Null_Keywords_Property()
        {
            // Arrange
            var answer = new Answer();

            // Act
            answer.Keywords = null;

            // Assert
            Assert.Null(answer.Keywords);
        }

        [Fact]
        public void Test_Response_IsNullInitially()
        {
            // Arrange
            var answer = new Answer();

            // Act
            string response = answer.Response;

            // Assert
            Assert.Null(response);
        }
    }
}

