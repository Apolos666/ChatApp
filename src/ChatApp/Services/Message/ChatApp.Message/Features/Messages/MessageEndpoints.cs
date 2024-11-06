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
    }

    private static async Task<IResult> SendMessage(
        [FromForm] SendMessageRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = SendMessageCommand.FromRequest(request);
        var result = await sender.Send(command, cancellationToken);
        return Results.Accepted(value: result);
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
}
