namespace ChatApp.Message.Options;

public class KafkaOptions
{
    public const string SectionName = "Kafka";
    public string BootstrapServers { get; init; } = null!;
    public string MessageTopic { get; init; } = null!;
    public string TypingTopic { get; init; } = null!;
    public string GroupId { get; init; } = null!;
    public string AutoOffsetReset { get; init; } = "Earliest";
    public bool EnableAutoCommit { get; init; } = true;
    public bool AllowAutoCreateTopics { get; init; } = true;
}