using Demo.DTOs;
using FluentValidation;

namespace Demo.Validators;

public class FacultyValidator : AbstractValidator<FacultyDTOs>
{
    public FacultyValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0);

        RuleFor(x => x.Department)
            .NotEmpty();

        RuleFor(x => x.Salary)
            .GreaterThan(0);
    }
}