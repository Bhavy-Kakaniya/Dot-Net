using Demo.DTOs;
using FluentValidation;

namespace Demo.Validators;

public class UserValidator : AbstractValidator<UserDto>
{
    public UserValidator()
    {
        RuleFor(x => x.Name)
        .NotEmpty()
        .MaximumLength(100);

        RuleFor(x => x.Email)
        .NotEmpty()
        .MaximumLength(50)
        .EmailAddress();

        RuleFor(x => x.Password)
        .NotEmpty()
        .MinimumLength(6);
    }
}