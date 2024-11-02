namespace ChatApp.Message.Features.Messages;

public class MessageEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var messageGroup = app.MapGroup("/api/messages")
            .RequireAuthorization()
            .WithTags("Messages");

        messageGroup.MapPost("/send", async (
            [FromForm] SendMessageCommand command,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(command, cancellationToken);
            return Results.Accepted(value: result);
        })
        .WithName("SendMessage")
        .WithDescription("Send a message with optional text content, images and videos to a room")
        .WithSummary("Send Message");
    }
}
