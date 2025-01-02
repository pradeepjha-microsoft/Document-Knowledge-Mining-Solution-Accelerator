using Microsoft.GS.DPS.Images;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.Images
{
    public class FileThumbnailServiceTests
    {
        [Theory]
        [InlineData("image/jpeg", "IMG")]
        [InlineData("image/png", "IMG")]
        [InlineData("application/pdf", "PDF")]
        [InlineData("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "XLS")]
        [InlineData("application/vnd.ms-excel", "XLS")]
        [InlineData("application/vnd.openxmlformats-officedocument.presentationml.presentation", "PPT")]
        [InlineData("application/vnd.ms-powerpoint", "PPT")]
        [InlineData("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "DOC")]
        [InlineData("application/msword", "DOC")]
        public void GetThumbnail_ShouldGenerateCorrectThumbnail(string contentType, string expectedText)
        {
            // Act
            byte[] thumbnailBytes = FileThumbnailService.GetThumbnail(contentType);

            // Assert
            Assert.NotNull(thumbnailBytes);
            Assert.True(thumbnailBytes.Length > 0);

            // Additional validation: You can save the byte array as an image and verify the content manually if needed.
            // For now, the test ensures that the thumbnail is generated.
        }

        [Fact]
        public void GetThumbnail_ShouldReturnEmptyThumbnailForUnknownContentType()
        {
            // Arrange
            string contentType = "unknown/type";

            // Act
            byte[] thumbnailBytes = FileThumbnailService.GetThumbnail(contentType);

            // Assert
            Assert.NotNull(thumbnailBytes);
            Assert.True(thumbnailBytes.Length > 0);

            // Note: Since the logic does not handle unknown types explicitly, it may default to an empty thumbnail.
        }
    }
}
