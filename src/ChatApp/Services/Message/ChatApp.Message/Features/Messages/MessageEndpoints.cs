namespace ChatApp.Message.Features.Messages;

public class MessageEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var messageGroup = app.MapGroup("/api/messages")
            .RequireAuthorization()
            .WithTags("Messages");

        messageGroup.MapPost("/send-text", async (
            SendMessageCommand command,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(command, cancellationToken);
            return Results.Accepted(value: result);
        })
        .WithName("SendTextMessage")
        .WithDescription("Send a text message to a room and return message ID")
        .WithSummary("Send Text Message");
    }
}
