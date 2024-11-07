namespace ChatApp.Message.Features.Messages;

public class MessageEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var messageGroup = app.MapGroup("/api/messages")
            .RequireAuthorization()
            .WithTags("Messages")
            .DisableAntiforgery();

        messageGroup.MapPost("/send", SendMessage)
            .WithName("SendMessage")
            .WithDescription("Send a message with optional text content, images and videos to a room")
            .WithSummary("Send Message");

        messageGroup.MapGet("/", GetMessages)
            .WithName("GetMessages")
            .WithDescription("Get messages for a room with pagination")
            .WithSummary("Get Messages");

        messageGroup.MapPost("/{id:int}/pin", PinMessage)
            .WithName("PinMessage")
            .WithDescription("Pin a message in a room")
            .WithSummary("Pin Message");

        messageGroup.MapPost("/{id:int}/unpin", UnpinMessage)
            .WithName("UnpinMessage")
            .WithDescription("Unpin a message in a room")
            .WithSummary("Unpin Message");
    }

    private static async Task<IResult> SendMessage(
        [FromForm] SendMessageRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = SendMessageCommand.FromRequest(request);
        var result = await sender.Send(command, cancellationToken);
        var response = new SendMessageResponse
        {
            MessageId = result.MessageId
        };
        return Results.Accepted(value: response);
    }

    private static async Task<IResult> GetMessages(
        [AsParameters] GetMessagesRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var query = GetMessagesQuery.FromRequest(request);
        var result = await sender.Send(query, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> PinMessage(
        int id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var request = new PinMessageRequest { MessageId = id };
        var command = PinMessageCommand.FromRequest(request.MessageId);
        var result = await sender.Send(command, cancellationToken);
        var response = new PinMessageResponse
        {
            MessageId = result.MessageId,
            PinnedAt = result.PinnedAt
        };
        return Results.Ok(response);
    }

    private static async Task<IResult> UnpinMessage(
        int id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var request = new UnpinMessageRequest { MessageId = id };
        var command = UnpinMessageCommand.FromRequest(request.MessageId);
        var result = await sender.Send(command, cancellationToken);
        var response = new UnpinMessageResponse
        {
            MessageId = result.MessageId
        };
        return Results.Ok(response);
    }
}
