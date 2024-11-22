using System.Runtime.Serialization;

namespace ChatApp.Message.Features.Common.Extensions;

public static class EnumExtensions
{
    public static T ToEnum<T>(this string value) where T : Enum
    {
        var type = typeof(T);
        foreach (var field in type.GetFields())
        {
            if (field.GetCustomAttributes(typeof(EnumMemberAttribute), false)
                    .FirstOrDefault() is EnumMemberAttribute attribute)
            {
                if (attribute.Value == value)
                    return (T)field.GetValue(null)!;
            }
        }

        throw new ArgumentException($"Value '{value}' not found in enum {typeof(T).Name}");
    }
}