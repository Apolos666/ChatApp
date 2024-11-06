namespace ChatApp.Message.Features.Messages.Queries.GetMessages;

public class GetMessagesQueryValidator : AbstractValidator<GetMessagesQuery>
{
    private const int MaxPageSize = 50;

    public GetMessagesQueryValidator()
    {
        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .WithMessage("RoomId must be greater than 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("PageSize must be greater than 0")
            .LessThanOrEqualTo(MaxPageSize)
            .WithMessage($"PageSize must not exceed {MaxPageSize}");

        When(x => x.LastMessageId.HasValue, () =>
        {
            RuleFor(x => x.LastMessageId!.Value)
                .GreaterThan(0)
                .WithMessage("LastMessageId must be greater than 0");
        });
    }
}