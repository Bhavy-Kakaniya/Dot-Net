using FluentValidation;
using StudentProjectManagementSystem.DTOs.Status;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateStatusValidator : AbstractValidator<CreateStatusDto>
    {
        public CreateStatusValidator()
        {
            RuleFor(x => x.StatusName)
                .NotEmpty()
                .WithMessage("Status name is required")
                .MinimumLength(2)
                .WithMessage("Status name must be at least 2 characters")
                .MaximumLength(100)
                .WithMessage("Status name cannot exceed 100 characters");
        }
    }

    public class UpdateStatusValidator : AbstractValidator<UpdateStatusDto>
    {
        public UpdateStatusValidator()
        {
            RuleFor(x => x.StatusName)
                .NotEmpty()
                .WithMessage("Status name is required")
                .MinimumLength(2)
                .WithMessage("Status name must be at least 2 characters")
                .MaximumLength(100)
                .WithMessage("Status name cannot exceed 100 characters");
        }
    }
}
