using AdminPanel.SRC.ViewModel;
using AdminPanel.Tests.Helpers;
using NUnit.Framework;

namespace AdminPanel.Tests.ViewModels;

[TestFixture]
public class LoginViewModelTests
{
    [Test]
    public void Constructor_InitializesDefaultState()
    {
        var vm = new LoginViewModel();

        Assert.That(vm.Username, Is.EqualTo(string.Empty));
        Assert.That(vm.Password, Is.Not.Null);
        Assert.That(vm.ErrorMessage, Is.EqualTo(string.Empty));
        Assert.That(vm.IsViewVisible, Is.True);
    }

    [Test]
    public void LoginCommand_CanExecute_False_WhenUsernameIsEmpty()
    {
        var vm = new LoginViewModel
        {
            Username = string.Empty,
            Password = SecureStringHelper.Create("123456")
        };

        Assert.That(vm.LoginCommand.CanExecute(null), Is.False);
    }

    [Test]
    public void LoginCommand_CanExecute_False_WhenUsernameTooShort()
    {
        var vm = new LoginViewModel
        {
            Username = "ab",
            Password = SecureStringHelper.Create("123456")
        };

        Assert.That(vm.LoginCommand.CanExecute(null), Is.False);
    }

    [Test]
    public void LoginCommand_CanExecute_False_WhenPasswordTooShort()
    {
        var vm = new LoginViewModel
        {
            Username = "admin",
            Password = SecureStringHelper.Create("12")
        };

        Assert.That(vm.LoginCommand.CanExecute(null), Is.False);
    }

    [Test]
    public void LoginCommand_CanExecute_True_WhenUsernameAndPasswordValid()
    {
        var vm = new LoginViewModel
        {
            Username = "admin",
            Password = SecureStringHelper.Create("123456")
        };

        Assert.That(vm.LoginCommand.CanExecute(null), Is.True);
    }
}
