using System.Runtime.Serialization;

namespace ChatApp.Message.Features.Common.Enums;

public enum Roles
{
    [EnumMember(Value = "ADMIN")]
    Admin = 1,
    [EnumMember(Value = "MODERATE USER")]
    ModerateUser = 2,
    [EnumMember(Value = "NORMAL USER")]
    NormalUser = 3
}