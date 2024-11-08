namespace ChatApp.Message.Features.Messages.Commands.UnpinMessage;

public class UnpinMessageCommandValidator : AbstractValidator<UnpinMessageCommand>
{
    public UnpinMessageCommandValidator()
    {
        RuleFor(x => x.MessageId)
            .GreaterThan(0)
            .WithMessage("MessageId must be greater than 0");
    }
}