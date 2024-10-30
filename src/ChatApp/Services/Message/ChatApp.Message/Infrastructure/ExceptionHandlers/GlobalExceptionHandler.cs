namespace ChatApp.Message.Infrastructure.ExceptionHandlers;
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    private record ErrorResponse(
        int StatusCode,
        string Message,
        string? Source = null,
        string? ExceptionType = null,
        string? StackTrace = null,
        IEnumerable<ValidationError>? Errors = null);

    private record ValidationError(string Property, string Error);

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
            "Error occurred while executing {Path}. Stack trace: {StackTrace}",
            httpContext.Request.Path,
            exception.StackTrace);

        var errorResponse = exception switch
        {
            FluentValidation.ValidationException fluentEx => new ErrorResponse(
                StatusCode: StatusCodes.Status400BadRequest,
                Message: "Validation failed",
                Source: fluentEx.Source,
                Errors: fluentEx.Errors.Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))),

            System.ComponentModel.DataAnnotations.ValidationException validationEx => new ErrorResponse(
                StatusCode: StatusCodes.Status400BadRequest,
                Message: validationEx.Message,
                Source: validationEx.Source),

            NotFoundException notFoundEx => new ErrorResponse(
                StatusCode: StatusCodes.Status404NotFound,
                Message: exception.Message,
                Source: notFoundEx.Source),

            UnauthorizedException unauthorizedEx => new ErrorResponse(
                StatusCode: StatusCodes.Status401Unauthorized,
                Message: exception.Message,
                Source: unauthorizedEx.Source),

            _ => new ErrorResponse(
                StatusCode: StatusCodes.Status500InternalServerError,
                Message: "An unexpected error occurred",
                Source: exception.Source,
                ExceptionType: exception.GetType().Name,
                StackTrace: exception.StackTrace)
        };

        httpContext.Response.StatusCode = errorResponse.StatusCode;
        await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);

        return true;
    }
}