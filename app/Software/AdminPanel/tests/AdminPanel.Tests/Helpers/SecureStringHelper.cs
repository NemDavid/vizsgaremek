using System.Security;

namespace AdminPanel.Tests.Helpers;

public static class SecureStringHelper
{
    public static SecureString Create(string value)
    {
        var secure = new SecureString();

        foreach (var c in value)
        {
            secure.AppendChar(c);
        }

        secure.MakeReadOnly();
        return secure;
    }
}
