namespace ChatApp.Message.Features.Messages.Commands.DeleteMessage;

public class DeleteMessageCommandHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IHubContext<ChatHub, IChatClient> hubContext)
    : IRequestHandler<DeleteMessageCommand, DeleteMessageResult>
{
    public async Task<DeleteMessageResult> Handle(
        DeleteMessageCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = httpContextAccessor.HttpContext?.GetCurrentUser()
                          ?? throw new UnauthorizedException();

        var message = await context.Messages
                          .FirstOrDefaultAsync(m => m.Id == request.MessageId, cancellationToken)
                      ?? throw new NotFoundException($"Message {request.MessageId} not found");

        // Cập nhật trạng thái tin nhắn
        message.IsDeleted = true;
        message.DeletedAt = DateTime.UtcNow;
        message.DeletedBy = currentUser.Id;

        await context.SaveChangesAsync(cancellationToken);

        // Gửi thông báo qua SignalR
        await hubContext.Clients.Group(message.RoomId.ToString())
            .MessageDeleted(new MessageDeletedDto
            {
                MessageId = message.Id,
                RoomId = message.RoomId!.Value,
                DeletedBy = currentUser.Id,
                DeletedAt = message.DeletedAt!.Value
            });

        return new DeleteMessageResult
        {
            MessageId = message.Id,
            Success = true
        };
    }
}