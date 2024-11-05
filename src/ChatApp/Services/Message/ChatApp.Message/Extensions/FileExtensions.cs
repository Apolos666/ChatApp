namespace ChatApp.Message.Extensions;

public static class FileExtensions
{
    private static readonly Dictionary<string, string> _mimeTypes = new()
    {
        {".jpg", "image/jpeg"},
        {".jpeg", "image/jpeg"},
        {".png", "image/png"},
        {".gif", "image/gif"},
        {".mp4", "video/mp4"},
        {".mpeg", "video/mpeg"},
        {".mov", "video/quicktime"}
    };

    public static string GetMimeType(this string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return _mimeTypes.TryGetValue(extension, out var mimeType) ? mimeType : "application/octet-stream";
    }
}