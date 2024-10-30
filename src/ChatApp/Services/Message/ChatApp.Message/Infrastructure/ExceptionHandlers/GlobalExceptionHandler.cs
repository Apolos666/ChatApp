namespace ChatApp.Message.Infrastructure.ExceptionHandlers;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            "Error occurred while executing {Path}",
            httpContext.Request.Path);

        var (statusCode, message) = exception switch
        {
            ValidationException => (StatusCodes.Status400BadRequest, exception.Message),
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
        };

        await httpContext.Response
            .WriteAsJsonAsync(new { statusCode, message }, cancellationToken);

        return true;
    }
}