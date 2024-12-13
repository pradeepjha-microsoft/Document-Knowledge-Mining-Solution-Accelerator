using FluentValidation.TestHelper;
using Microsoft.GS.DPS.Model.UserInterface;
using System;
using System.Collections.Generic;
using Xunit;

namespace Microsoft.GS.DPS.Tests.ModelsTest
{

    public class PagingRequestWithSearchValidatorTests
    {
        private readonly PagingRequestWithSearchValidator _validator;

        public PagingRequestWithSearchValidatorTests()
        {
            _validator = new PagingRequestWithSearchValidator();
        }

        [Fact]
        public void Should_Have_Error_When_PageNumber_Is_Less_Than_Or_Equal_To_Zero()
        {
            var model = new PagingRequestWithSearch { PageNumber = 0 };
            var result = _validator.TestValidate(model);
            result.ShouldHaveValidationErrorFor(x => x.PageNumber);
        }

        [Fact]
        public void Should_Have_Error_When_PageSize_Is_Less_Than_Or_Equal_To_Zero()
        {
            var model = new PagingRequestWithSearch { PageSize = 0 };
            var result = _validator.TestValidate(model);
            result.ShouldHaveValidationErrorFor(x => x.PageSize);
        }

        [Fact]
        public void Should_Pass_When_PageNumber_Is_Greater_Than_Zero()
        {
            var model = new PagingRequestWithSearch { PageNumber = 1 };
            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.PageNumber);
        }

        [Fact]
        public void Should_Pass_When_PageSize_Is_Greater_Than_Zero()
        {
            var model = new PagingRequestWithSearch { PageSize = 10 };
            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.PageSize);
        }

        [Fact]
        public void Should_Have_Error_When_StartDate_Is_Later_Than_EndDate()
        {
            var model = new PagingRequestWithSearch
            {
                StartDate = new DateTime(2024, 12, 10),
                EndDate = new DateTime(2024, 12, 9)
            };

            var result = _validator.TestValidate(model);
            result.ShouldHaveValidationErrorFor(x => x.StartDate)
                  .WithErrorMessage("Start Date cannot be later than End Date");
        }

        [Fact]
        public void Should_Not_Have_Error_When_StartDate_Is_Equal_To_EndDate()
        {
            var model = new PagingRequestWithSearch
            {
                StartDate = new DateTime(2024, 12, 10),
                EndDate = new DateTime(2024, 12, 10)
            };

            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.StartDate);
        }

        [Fact]
        public void Should_Have_Error_When_StartDate_Is_Empty_And_EndDate_Is_Provided()
        {
            var model = new PagingRequestWithSearch
            {
                EndDate = new DateTime(2024, 12, 10)
            };

            var result = _validator.TestValidate(model);
            result.ShouldHaveValidationErrorFor(x => x.StartDate)
                  .WithErrorMessage("Start Date cannot be empty when End Date is provided");
        }

        [Fact]
        public void Should_Not_Have_Error_When_StartDate_And_EndDate_Are_Both_Null()
        {
            var model = new PagingRequestWithSearch();
            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.StartDate);
        }

        [Fact]
        public void Should_Not_Have_Error_When_Keyword_Is_Null_Or_Empty()
        {
            var model = new PagingRequestWithSearch { Keyword = null };
            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.Keyword);
        }        

        [Fact]
        public void Should_Pass_When_Tags_Are_Empty()
        {
            var model = new PagingRequestWithSearch { Tags = new Dictionary<string, string>() };
            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.Tags);
        }

        [Fact]
        public void Should_Pass_When_Tags_Are_Valid()
        {
            var model = new PagingRequestWithSearch
            {
                Tags = new Dictionary<string, string>
            {
                { "tag1", "value1" },
                { "tag2", "value2" }
            }
            };

            var result = _validator.TestValidate(model);
            result.ShouldNotHaveValidationErrorFor(x => x.Tags);
        }
    }
}
