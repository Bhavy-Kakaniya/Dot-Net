using Demo.DTOs;
using FluentValidation;

public class StudentValidator : AbstractValidator<StudentDto>
{
    public StudentValidator()
    {
        RuleFor(x => x.UserId)
        .NotEmpty()
        .GreaterThan(0);

        RuleFor(x => x.FacultyId)
        .NotEmpty()
        .GreaterThan(0);
        
        RuleFor(x => x.Age)
        .NotEmpty()
        .GreaterThan(0);
        
    }
}