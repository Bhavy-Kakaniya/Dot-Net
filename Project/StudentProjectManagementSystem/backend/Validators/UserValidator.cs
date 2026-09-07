using FluentValidation;
using StudentProjectManagementSystem.DTOs.user;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.UserTypeId)
                .GreaterThan(0)
                .WithMessage("User type is required");

            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("Full name is required")
                .Must(name => !string.IsNullOrWhiteSpace(name))
                .WithMessage("Full name cannot be empty or whitespace")
                .MaximumLength(150)
                .WithMessage("Full name cannot exceed 150 characters");

            RuleFor(x => x.UserCode)
                .MaximumLength(100)
                .WithMessage("User code cannot exceed 100 characters")
                .When(x => x.UserCode != null);

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Please enter a valid email address")
                .MaximumLength(150)
                .WithMessage("Email cannot exceed 150 characters");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password is required")
                .MinimumLength(6)
                .WithMessage("Password must be at least 6 characters")
                .Must(p => p.Any(char.IsUpper))
                .WithMessage("Password must contain at least one uppercase letter")
                .Must(p => p.Any(char.IsDigit))
                .WithMessage("Password must contain at least one number");

            RuleFor(x => x.MobileNumber)
                .NotEmpty()
                .WithMessage("Mobile number is required")
                .Must(m => m.All(char.IsDigit))
                .WithMessage("Mobile number must contain digits only")
                .Must(m => m.Length >= 10 && m.Length <= 15)
                .WithMessage("Mobile number must be between 10 and 15 digits");

            RuleFor(x => x.ProfilePicturePath)
                .NotEmpty()
                .WithMessage("Profile picture path is required")
                .MaximumLength(500)
                .WithMessage("Profile picture path cannot exceed 500 characters");
        }
    }

    public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserValidator()
        {
            RuleFor(x => x.UserTypeId)
                .GreaterThan(0)
                .WithMessage("User type is required");

            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("Full name is required")
                .Must(name => !string.IsNullOrWhiteSpace(name))
                .WithMessage("Full name cannot be empty or whitespace")
                .MaximumLength(150)
                .WithMessage("Full name cannot exceed 150 characters");

            RuleFor(x => x.UserCode)
                .MaximumLength(100)
                .WithMessage("User code cannot exceed 100 characters")
                .When(x => x.UserCode != null);

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Please enter a valid email address")
                .MaximumLength(150)
                .WithMessage("Email cannot exceed 150 characters");

            RuleFor(x => x.MobileNumber)
                .NotEmpty()
                .WithMessage("Mobile number is required")
                .Must(m => m.All(char.IsDigit))
                .WithMessage("Mobile number must contain digits only")
                .Must(m => m.Length >= 10 && m.Length <= 15)
                .WithMessage("Mobile number must be between 10 and 15 digits");

            RuleFor(x => x.ProfilePicturePath)
                .NotEmpty()
                .WithMessage("Profile picture path is required")
                .MaximumLength(500)
                .WithMessage("Profile picture path cannot exceed 500 characters");
        }
    }
}
