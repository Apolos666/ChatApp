namespace ChatApp.Message.Features.Messages.Commands.PinMessage;

public class PinMessageCommandValidator : AbstractValidator<PinMessageCommand>
{
    public PinMessageCommandValidator()
    {
        RuleFor(x => x.MessageId)
            .GreaterThan(0)
            .WithMessage("MessageId must be greater than 0");
    }
}