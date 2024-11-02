public interface ICloudinaryService
{
    Task<(string url, string publicId)> UploadAsync(
        IFormFile file,
        string folder,
        CancellationToken cancellationToken = default);
    Task DeleteAsync(string publicId);
}