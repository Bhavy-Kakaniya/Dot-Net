using FluentValidation;
using StudentProjectManagementSystem.DTOs.Role;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateRoleValidator : AbstractValidator<CreateRoleDto>
    {
        public CreateRoleValidator()
        {
            RuleFor(x => x.RoleName)
                .NotEmpty()
                .WithMessage("Role name is required")
                .MinimumLength(2)
                .WithMessage("Role name must be at least 2 characters")
                .MaximumLength(50)
                .WithMessage("Role name cannot exceed 50 characters");

            RuleFor(x => x.Description)
                .MaximumLength(250)
                .WithMessage("Description cannot exceed 250 characters")
                .When(x => x.Description != null);
        }
    }

    public class UpdateRoleValidator : AbstractValidator<UpdateRoleDto>
    {
        public UpdateRoleValidator()
        {
            RuleFor(x => x.RoleName)
                .NotEmpty()
                .WithMessage("Role name is required")
                .MinimumLength(2)
                .WithMessage("Role name must be at least 2 characters")
                .MaximumLength(50)
                .WithMessage("Role name cannot exceed 50 characters");

            RuleFor(x => x.Description)
                .MaximumLength(250)
                .WithMessage("Description cannot exceed 250 characters")
                .When(x => x.Description != null);
        }
    }
}
