using FluentValidation.TestHelper;
using Microsoft.GS.DPS.Model.UserInterface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Tests.ModelsTest.UserInterface
{
    public class PagingRequestValidatorTest
    {
        private readonly PagingRequestValidator _validator;
        public PagingRequestValidatorTest()
        {
            _validator = new PagingRequestValidator();
        }

        [Fact]
        public void Validate_ValidPagingRequest_ShouldPassValidation()
        {
            var request = new PagingRequest
            {
                PageNumber = 1,
                PageSize = 10,
                StartDate = DateTime.UtcNow.AddDays(-7),
                EndDate = DateTime.UtcNow
            };

            var result = _validator.TestValidate(request);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void Validate_PageNumberIsZero_ShouldFailValidation()
        {
            var request = new PagingRequest
            {
                PageNumber = 0,
                PageSize = 10
            };

            var result = _validator.TestValidate(request);
            result.ShouldHaveValidationErrorFor(r => r.PageNumber);
        }

        [Fact]
        public void Validate_PageSizeIsNegative_ShouldFailValidation()
        {
            var request = new PagingRequest
            {
                PageNumber = 1,
                PageSize = -5
            };

            var result = _validator.TestValidate(request);
            result.ShouldHaveValidationErrorFor(r => r.PageSize);
        }

        [Fact]
        public void Validate_OptionalFieldsNull_ShouldPassValidation()
        {
            var request = new PagingRequest
            {
                PageNumber = 1,
                PageSize = 10,
                StartDate = null,
                EndDate = null
            };

            var result = _validator.TestValidate(request);
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}

