using System.Reflection;
using System.Runtime.Serialization;

namespace AdminPanel.Tests.Helpers;

public static class ReflectionHelper
{
    public static T CreateWithoutConstructor<T>() where T : class
    {
#pragma warning disable SYSLIB0050
        return (T)FormatterServices.GetUninitializedObject(typeof(T));
#pragma warning restore SYSLIB0050
    }

    public static void SetPrivateField(object target, string fieldName, object? value)
    {
        var field = target.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.NonPublic);
        if (field is null)
            throw new MissingFieldException(target.GetType().FullName, fieldName);

        field.SetValue(target, value);
    }

    public static object? GetPrivateField(object target, string fieldName)
    {
        var field = target.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.NonPublic);
        if (field is null)
            throw new MissingFieldException(target.GetType().FullName, fieldName);

        return field.GetValue(target);
    }

    public static async Task InvokePrivateAsync(object target, string methodName, params object?[]? args)
    {
        var method = target.GetType().GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic);
        if (method is null)
            throw new MissingMethodException(target.GetType().FullName, methodName);

        var result = method.Invoke(target, args);
        if (result is Task task)
        {
            await task;
        }
    }

    public static object? InvokePrivate(object target, string methodName, params object?[]? args)
    {
        var method = target.GetType().GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic);
        if (method is null)
            throw new MissingMethodException(target.GetType().FullName, methodName);

        return method.Invoke(target, args);
    }
}
