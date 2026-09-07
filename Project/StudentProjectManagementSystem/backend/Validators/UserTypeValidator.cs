using FluentValidation;
using StudentProjectManagementSystem.DTOs.UserType;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateUserTypeValidator : AbstractValidator<CreateUserTypeDto>
    {
        public CreateUserTypeValidator()
        {
            RuleFor(x => x.UserTypeName)
                .NotEmpty()
                .WithMessage("User type name is required")
                .MinimumLength(2)
                .WithMessage("User type name must be at least 2 characters")
                .MaximumLength(50)
                .WithMessage("User type name cannot exceed 50 characters");

            RuleFor(x => x.Description)
                .MaximumLength(250)
                .WithMessage("Description cannot exceed 250 characters")
                .When(x => x.Description != null);
        }
    }

    public class UpdateUserTypeValidator : AbstractValidator<UpdateUserTypeDto>
    {
        public UpdateUserTypeValidator()
        {
            RuleFor(x => x.UserTypeName)
                .NotEmpty()
                .WithMessage("User type name is required")
                .MinimumLength(2)
                .WithMessage("User type name must be at least 2 characters")
                .MaximumLength(50)
                .WithMessage("User type name cannot exceed 50 characters");

            RuleFor(x => x.Description)
                .MaximumLength(250)
                .WithMessage("Description cannot exceed 250 characters")
                .When(x => x.Description != null);
        }
    }
}
