using FluentValidation;
using StudentProjectManagementSystem.DTOs.Project;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateProjectValidator : AbstractValidator<CreateProjectDto>
    {
        public CreateProjectValidator()
        {
            RuleFor(x => x.ProjectTitle)
                .NotEmpty()
                .WithMessage("Project title is required")
                .MinimumLength(3)
                .WithMessage("Project title must be at least 3 characters")
                .MaximumLength(150)
                .WithMessage("Project title cannot exceed 150 characters");
        }
    }

    public class UpdateProjectValidator : AbstractValidator<UpdateProjectDto>
    {
        public UpdateProjectValidator()
        {
            RuleFor(x => x.ProjectTitle)
                .NotEmpty()
                .WithMessage("Project title is required")
                .MinimumLength(3)
                .WithMessage("Project title must be at least 3 characters")
                .MaximumLength(150)
                .WithMessage("Project title cannot exceed 150 characters");
        }
    }
}
