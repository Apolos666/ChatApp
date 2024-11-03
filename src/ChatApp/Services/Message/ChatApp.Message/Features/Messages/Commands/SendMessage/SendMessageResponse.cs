namespace ChatApp.Message.Features.Messages.Contracts.Responses;

public record SendMessageResponse
{
    public int MessageId { get; init; }
}
