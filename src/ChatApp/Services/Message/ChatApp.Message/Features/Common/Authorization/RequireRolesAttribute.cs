using ChatApp.Message.Features.Common.Enums;

namespace ChatApp.Message.Features.Common.Authorization;

public class RequireRolesAttribute : AuthorizeAttribute, IAuthorizationRequirementData
{
    public RequireRolesAttribute(params Roles[] allowedRoles)
    {
        AllowedRoles = allowedRoles;
        Policy = $"RequireRoles_{string.Join("_", allowedRoles)}";
    }

    private Roles[] AllowedRoles { get; }

    public IEnumerable<IAuthorizationRequirement> GetRequirements()
    {
        yield return new RoleRequirement(AllowedRoles);
    }
}

public class RoleRequirement(Roles[] allowedRoles) : IAuthorizationRequirement
{
    public Roles[] AllowedRoles { get; } = allowedRoles;
}