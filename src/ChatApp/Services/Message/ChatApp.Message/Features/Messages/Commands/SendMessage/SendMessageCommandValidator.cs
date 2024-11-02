namespace ChatApp.Message.Features.Messages.Commands.SendMessage;

public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    private readonly string[] _allowedImageTypes = { "image/jpeg", "image/png", "image/gif" };
    private readonly string[] _allowedVideoTypes = { "video/mp4", "video/mpeg", "video/quicktime" };
    private const int MaxFileSize = 100 * 1024 * 1024; // 100MB

    public SendMessageCommandValidator()
    {
        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .WithMessage("RoomId must be greater than 0");

        RuleFor(x => x)
            .Must(x => !string.IsNullOrEmpty(x.Content) || (x.Files != null && x.Files.Any()))
            .WithMessage("Message must contain either text content or files");

        When(x => x.Files != null && x.Files.Any(), () =>
        {
            RuleForEach(x => x.Files)
                .Must(file => file.Length <= MaxFileSize)
                .WithMessage($"File size must not exceed {MaxFileSize / 1024 / 1024}MB")
                .Must(IsValidFileType)
                .WithMessage("Only image files (jpg, png, gif) and video files (mp4, mpeg, mov) are allowed");
        });
    }

    private bool IsValidFileType(IFormFile file)
    {
        var contentType = file.ContentType.ToLower();
        return _allowedImageTypes.Contains(contentType) ||
               _allowedVideoTypes.Contains(contentType);
    }
}