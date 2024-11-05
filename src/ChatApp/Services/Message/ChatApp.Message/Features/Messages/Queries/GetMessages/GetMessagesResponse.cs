namespace ChatApp.Message.Features.Messages.Contracts.Responses;

public record GetMessagesResponse
{
    public List<MessageDto> Messages { get; init; } = [];
    public bool HasMore { get; init; }
}