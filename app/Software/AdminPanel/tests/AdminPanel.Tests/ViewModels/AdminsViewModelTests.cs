using System.Collections.ObjectModel;
using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using AdminPanel.Tests.Helpers;
using NUnit.Framework;

namespace AdminPanel.Tests.ViewModels;

[TestFixture]
public class AdminsViewModelTests
{
    private static AdminsViewModel CreateVm()
    {
        var vm = ReflectionHelper.CreateWithoutConstructor<AdminsViewModel>();

        vm.Admins = new ObservableCollection<AdminUserModelWithProfile>();
        ReflectionHelper.SetPrivateField(vm, "_allAdminsBackup", new ObservableCollection<AdminUserModelWithProfile>());
        ReflectionHelper.SetPrivateField(vm, "_searchText", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_errorMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_successMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_targetUserId", string.Empty);

        return vm;
    }

    [Test]
    public void SelectedAdmin_LoadsSelectedFields()
    {
        var vm = CreateVm();
        var admin = new AdminUserModelWithProfile
        {
            ID = 11,
            username = "owner",
            email = "owner@test.hu",
            role = "owner",
            created_at = "2026-03-12"
        };

        vm.SelectedAdmin = admin;

        Assert.That(vm.SelectedId, Is.EqualTo(11));
        Assert.That(vm.SelectedUsername, Is.EqualTo("owner"));
        Assert.That(vm.SelectedEmail, Is.EqualTo("owner@test.hu"));
        Assert.That(vm.SelectedRole, Is.EqualTo("owner"));
        Assert.That(vm.SelectedCreatedAt, Is.EqualTo("2026-03-12"));
    }

    [Test]
    public void SearchText_FiltersAdmins_ByRole()
    {
        var vm = CreateVm();
        var allAdmins = new ObservableCollection<AdminUserModelWithProfile>
        {
            new() { ID = 1, username = "adam", email = "a@test.hu", role = "admin" },
            new() { ID = 2, username = "oliver", email = "o@test.hu", role = "owner" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allAdminsBackup", allAdmins);

        vm.SearchText = "owner";

        Assert.That(vm.Admins.Count, Is.EqualTo(1));
        Assert.That(vm.Admins[0].username, Is.EqualTo("oliver"));
    }

    [Test]
    public void SearchText_Empty_RestoresAllAdmins()
    {
        var vm = CreateVm();
        var allAdmins = new ObservableCollection<AdminUserModelWithProfile>
        {
            new() { ID = 1, username = "adam", email = "a@test.hu", role = "admin" },
            new() { ID = 2, username = "oliver", email = "o@test.hu", role = "owner" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allAdminsBackup", allAdmins);

        vm.SearchText = string.Empty;

        Assert.That(vm.Admins.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task ChangeRoleByTargetIdAsync_SetsError_WhenNotOwner()
    {
        var vm = CreateVm();
        vm.IsOwner = false;
        vm.TargetUserId = "12";

        await ReflectionHelper.InvokePrivateAsync(vm, "ChangeRoleByTargetIdAsync", "admin");

        Assert.That(vm.ErrorMessage, Is.EqualTo("Ehhez owner jogosultság kell."));
    }

    [Test]
    public async Task ChangeRoleByTargetIdAsync_SetsError_WhenTargetIdInvalid()
    {
        var vm = CreateVm();
        vm.IsOwner = true;
        vm.TargetUserId = "abc";

        await ReflectionHelper.InvokePrivateAsync(vm, "ChangeRoleByTargetIdAsync", "admin");

        Assert.That(vm.ErrorMessage, Is.EqualTo("Adj meg egy érvényes ID-t."));
    }
}
