namespace ChatApp.Message.Middleware;

public class CurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public CurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var email = context.User.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(email))
            {
                var user = await dbContext.Users
                    .Include(u => u.Role)
                    .Select(u => new CurrentUser
                    {
                        Id = u.Id,
                        Email = u.Email,
                        Name = u.Name,
                        IsActive = u.IsActive,
                        RoleId = u.RoleId,
                        PhoneNumber = u.PhoneNumber,
                        Address = u.Address,
                        RoleName = u.Role!.Name
                    })
                    .FirstOrDefaultAsync(u => u.Email == email);

                if (user != null)
                {
                    context.Items["CurrentUser"] = user;
                }
            }
        }

        await _next(context);
    }
}

public static class CurrentUserMiddlewareExtensions
{
    public static IApplicationBuilder UseCurrentUser(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CurrentUserMiddleware>();
    }
}