using System;

public class AppException : Exception
{
    public AppException(string message) : base(message) { }
}

public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message) { }
}

public class ValidationException : AppException
{
    public ValidationException(string message) : base(message) { }
}

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Unauthorized") : base(message) { }
}