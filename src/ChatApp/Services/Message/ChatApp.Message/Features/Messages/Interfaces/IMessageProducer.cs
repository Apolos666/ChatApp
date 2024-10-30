namespace ChatApp.Message.Features.Messages.Interfaces;

public interface IMessageProducer
{
    Task ProduceAsync(string topic, MessageDto message, CancellationToken cancellationToken = default);
}