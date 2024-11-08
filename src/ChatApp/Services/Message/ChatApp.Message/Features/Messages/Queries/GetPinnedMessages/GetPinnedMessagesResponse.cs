namespace ChatApp.Message.Features.Messages.Queries.GetPinnedMessages;

public record GetPinnedMessagesResponse
{
    public List<MessagePinnedDto> Messages { get; init; } = [];
}