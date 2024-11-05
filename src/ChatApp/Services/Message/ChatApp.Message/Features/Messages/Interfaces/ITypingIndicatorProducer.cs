namespace ChatApp.Message.Features.Messages.Interfaces;

public interface ITypingIndicatorProducer
{
    Task ProduceAsync(string topic, TypingIndicatorDto typing, CancellationToken cancellationToken = default);
}