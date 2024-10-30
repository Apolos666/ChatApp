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
            return Results.Ok(result);
        })
        .WithName("SendTextMessage")
        .WithDescription("Send a text message to a room")
        .WithSummary("Send Text Message");

        // messageGroup.MapPost("/send-with-attachments", async (
        //     SendMessageCommand command,
        //     IFormFileCollection files,
        //     ISender sender,
        //     CancellationToken cancellationToken) =>
        // {
        //     var result = await sender.Send(command, cancellationToken);
        //     return Results.Ok(result);
        // })
        // .WithName("SendMessageWithAttachments")
        // .WithDescription("Send a message with attachments to a room")
        // .WithSummary("Send Message With Attachments");
    }
}
