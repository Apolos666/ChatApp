using ChatApp.Message.Features.Common.Enums;
using ChatApp.Message.Features.Common.Extensions;

namespace ChatApp.Message.Features.Common.Authorization;

public class RoleAuthorizationHandler : AuthorizationHandler<RoleRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RoleAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        RoleRequirement requirement)
    {
        var currentUser = _httpContextAccessor.HttpContext?.GetCurrentUser();
        if (currentUser == null)
        {
            return Task.CompletedTask;
        }

        var userRole = currentUser.RoleName.ToEnum<Roles>();
        if (requirement.AllowedRoles.Contains(userRole))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}