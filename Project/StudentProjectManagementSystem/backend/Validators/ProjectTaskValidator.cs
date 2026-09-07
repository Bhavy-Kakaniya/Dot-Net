using FluentValidation;
using StudentProjectManagementSystem.DTOs.ProjectTask;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateProjectTaskValidator : AbstractValidator<CreateProjectTaskDto>
    {
        public CreateProjectTaskValidator()
        {
            RuleFor(x => x.ProjectAllocationId)
                .GreaterThan(0)
                .WithMessage("A valid project allocation must be selected");

            RuleFor(x => x.TaskTitle)
                .NotEmpty()
                .WithMessage("Task title is required")
                .MaximumLength(200)
                .WithMessage("Task title cannot exceed 200 characters");

            RuleFor(x => x.TaskDescription)
                .MaximumLength(2000)
                .WithMessage("Task description cannot exceed 2000 characters")
                .When(x => x.TaskDescription != null);

            RuleFor(x => x.TaskStatusId)
                .GreaterThan(0)
                .WithMessage("A valid task status must be selected");

            RuleFor(x => x.TaskPriorityId)
                .GreaterThan(0)
                .WithMessage("A valid task priority must be selected");

            RuleFor(x => x.AssignedScore)
                .Must(score => score >= 0 && score <= 100)
                .WithMessage("Assigned score must be between 0 and 100");

            RuleFor(x => x.EarnedScore)
                .Must(score => score >= 0)
                .WithMessage("Earned score cannot be negative")
                .Must((dto, score) => score <= dto.AssignedScore)
                .WithMessage("Earned score cannot exceed the assigned score")
                .When(x => x.EarnedScore.HasValue);

            RuleFor(x => x.ProgressPercentage)
                .Must(p => p >= 0 && p <= 100)
                .WithMessage("Progress percentage must be between 0 and 100")
                .When(x => x.ProgressPercentage.HasValue);

            RuleFor(x => x.TaskDueDate)
                .Must((dto, dueDate) => dueDate >= dto.TaskStartDate)
                .WithMessage("Task due date must be on or after the start date")
                .When(x => x.TaskDueDate.HasValue && x.TaskStartDate.HasValue);

            RuleFor(x => x.TaskCompletedDate)
                .Must((dto, completedDate) => completedDate >= dto.TaskStartDate)
                .WithMessage("Task completed date must be on or after the start date")
                .When(x => x.TaskCompletedDate.HasValue && x.TaskStartDate.HasValue);

            RuleFor(x => x.FacultyRemarks)
                .MaximumLength(500)
                .WithMessage("Faculty remarks cannot exceed 500 characters")
                .When(x => x.FacultyRemarks != null);

            RuleFor(x => x.StudentRemarks)
                .MaximumLength(500)
                .WithMessage("Student remarks cannot exceed 500 characters")
                .When(x => x.StudentRemarks != null);
        }
    }

    public class UpdateProjectTaskValidator : AbstractValidator<UpdateProjectTaskDto>
    {
        public UpdateProjectTaskValidator()
        {
            RuleFor(x => x.ProjectAllocationId)
                .GreaterThan(0)
                .WithMessage("A valid project allocation must be selected");

            RuleFor(x => x.TaskTitle)
                .NotEmpty()
                .WithMessage("Task title is required")
                .MaximumLength(200)
                .WithMessage("Task title cannot exceed 200 characters");

            RuleFor(x => x.TaskDescription)
                .MaximumLength(2000)
                .WithMessage("Task description cannot exceed 2000 characters")
                .When(x => x.TaskDescription != null);

            RuleFor(x => x.TaskStatusId)
                .GreaterThan(0)
                .WithMessage("A valid task status must be selected");

            RuleFor(x => x.TaskPriorityId)
                .GreaterThan(0)
                .WithMessage("A valid task priority must be selected");

            RuleFor(x => x.AssignedScore)
                .Must(score => score >= 0 && score <= 100)
                .WithMessage("Assigned score must be between 0 and 100");

            RuleFor(x => x.EarnedScore)
                .Must(score => score >= 0)
                .WithMessage("Earned score cannot be negative")
                .Must((dto, score) => score <= dto.AssignedScore)
                .WithMessage("Earned score cannot exceed the assigned score")
                .When(x => x.EarnedScore.HasValue);

            RuleFor(x => x.ProgressPercentage)
                .Must(p => p >= 0 && p <= 100)
                .WithMessage("Progress percentage must be between 0 and 100")
                .When(x => x.ProgressPercentage.HasValue);

            RuleFor(x => x.TaskDueDate)
                .Must((dto, dueDate) => dueDate >= dto.TaskStartDate)
                .WithMessage("Task due date must be on or after the start date")
                .When(x => x.TaskDueDate.HasValue && x.TaskStartDate.HasValue);

            RuleFor(x => x.TaskCompletedDate)
                .Must((dto, completedDate) => completedDate >= dto.TaskStartDate)
                .WithMessage("Task completed date must be on or after the start date")
                .When(x => x.TaskCompletedDate.HasValue && x.TaskStartDate.HasValue);

            RuleFor(x => x.FacultyRemarks)
                .MaximumLength(500)
                .WithMessage("Faculty remarks cannot exceed 500 characters")
                .When(x => x.FacultyRemarks != null);

            RuleFor(x => x.StudentRemarks)
                .MaximumLength(500)
                .WithMessage("Student remarks cannot exceed 500 characters")
                .When(x => x.StudentRemarks != null);
        }
    }
}
