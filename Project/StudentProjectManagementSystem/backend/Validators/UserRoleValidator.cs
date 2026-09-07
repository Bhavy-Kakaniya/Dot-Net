using FluentValidation;
using StudentProjectManagementSystem.DTOs.UserRole;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateUserRoleValidator : AbstractValidator<CreateUserRoleDto>
    {
        public CreateUserRoleValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage("A valid user must be selected");

            RuleFor(x => x.RoleId)
                .GreaterThan(0)
                .WithMessage("A valid role must be selected");
        }
    }

    public class UpdateUserRoleValidator : AbstractValidator<UpdateUserRoleDto>
    {
        public UpdateUserRoleValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage("A valid user must be selected");

            RuleFor(x => x.RoleId)
                .GreaterThan(0)
                .WithMessage("A valid role must be selected");
        }
    }
}
