public class CloudinaryOptions
{
    public const string SectionName = "Cloudinary";

    public required string CloudName { get; init; }
    public required string ApiKey { get; init; }
    public required string ApiSecret { get; init; }
}