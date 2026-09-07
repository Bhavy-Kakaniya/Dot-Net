using FluentValidation;
using StudentProjectManagementSystem.DTOs.ProjectAllocation;

namespace StudentProjectManagementSystem.Validators
{
    public class CreateProjectAllocationValidator : AbstractValidator<CreateProjectAllocationDto>
    {
        public CreateProjectAllocationValidator()
        {
            RuleFor(x => x.ProjectId)
                .GreaterThan(0)
                .WithMessage("A valid project must be selected");

            RuleFor(x => x.StudentId)
                .GreaterThan(0)
                .WithMessage("A valid student must be selected");

            RuleFor(x => x.FacultyId)
                .GreaterThan(0)
                .WithMessage("A valid faculty must be selected");

            RuleFor(x => x.AssignedDate)
                .NotEmpty()
                .WithMessage("Assigned date is required")
                .Must(date => date <= DateTime.Today.AddDays(1))
                .WithMessage("Assigned date cannot be a future date");

            RuleFor(x => x.ProjectStartDate)
                .NotEmpty()
                .WithMessage("Project start date is required");

            RuleFor(x => x.ProjectEndDate)
                .NotEmpty()
                .WithMessage("Project end date is required")
                .Must((dto, endDate) => endDate > dto.ProjectStartDate)
                .WithMessage("Project end date must be after the start date");

            RuleFor(x => x.TotalTasksGiven)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total tasks given cannot be negative");

            RuleFor(x => x.TotalCompletedTasks)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total completed tasks cannot be negative")
                .Must((dto, completed) => completed <= dto.TotalTasksGiven)
                .WithMessage("Completed tasks cannot exceed total tasks given");

            RuleFor(x => x.ProgressPercentage)
                .Must(p => p >= 0 && p <= 100)
                .WithMessage("Progress percentage must be between 0 and 100");

            RuleFor(x => x.OverallGrade)
                .Must(grade => "ABCDEFabcdef".Contains(grade!))
                .WithMessage("Overall grade must be A, B, C, D, E or F")
                .When(x => !string.IsNullOrEmpty(x.OverallGrade));
        }
    }

    public class UpdateProjectAllocationValidator : AbstractValidator<UpdateProjectAllocationDto>
    {
        public UpdateProjectAllocationValidator()
        {
            RuleFor(x => x.ProjectId)
                .GreaterThan(0)
                .WithMessage("A valid project must be selected");

            RuleFor(x => x.StudentId)
                .GreaterThan(0)
                .WithMessage("A valid student must be selected");

            RuleFor(x => x.FacultyId)
                .GreaterThan(0)
                .WithMessage("A valid faculty must be selected");

            RuleFor(x => x.AssignedDate)
                .NotEmpty()
                .WithMessage("Assigned date is required")
                .Must(date => date <= DateTime.Today.AddDays(1))
                .WithMessage("Assigned date cannot be a future date");

            RuleFor(x => x.ProjectStartDate)
                .NotEmpty()
                .WithMessage("Project start date is required");

            RuleFor(x => x.ProjectEndDate)
                .NotEmpty()
                .WithMessage("Project end date is required")
                .Must((dto, endDate) => endDate > dto.ProjectStartDate)
                .WithMessage("Project end date must be after the start date");

            RuleFor(x => x.TotalTasksGiven)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total tasks given cannot be negative");

            RuleFor(x => x.TotalCompletedTasks)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total completed tasks cannot be negative")
                .Must((dto, completed) => completed <= dto.TotalTasksGiven)
                .WithMessage("Completed tasks cannot exceed total tasks given");

            RuleFor(x => x.ProgressPercentage)
                .Must(p => p >= 0 && p <= 100)
                .WithMessage("Progress percentage must be between 0 and 100");

            RuleFor(x => x.OverallGrade)
                .Must(grade => "ABCDEFabcdef".Contains(grade!))
                .WithMessage("Overall grade must be A, B, C, D, E or F")
                .When(x => !string.IsNullOrEmpty(x.OverallGrade));
        }
    }
}
