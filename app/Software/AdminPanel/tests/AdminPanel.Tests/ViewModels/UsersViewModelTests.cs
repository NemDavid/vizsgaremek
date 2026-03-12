using System.Collections.ObjectModel;
using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using AdminPanel.Tests.Helpers;
using NUnit.Framework;

namespace AdminPanel.Tests.ViewModels;

[TestFixture]
public class UsersViewModelTests
{
    private static UsersViewModel CreateVm()
    {
        var vm = ReflectionHelper.CreateWithoutConstructor<UsersViewModel>();

        vm.Users = new ObservableCollection<UserModel>();
        ReflectionHelper.SetPrivateField(vm, "_allUsersBackup", new ObservableCollection<UserModel>());
        ReflectionHelper.SetPrivateField(vm, "_searchText", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_errorMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_successMessage", string.Empty);

        return vm;
    }

    [Test]
    public void SelectedUser_LoadsUserFieldsIntoSelectedProperties()
    {
        var vm = CreateVm();
        var user = new UserModel
        {
            ID = 7,
            username = "admin",
            email = "admin@test.hu",
            role = "user",
            created_at = "2026-03-12",
            profile = new ProfileModel
            {
                first_name = "Teszt",
                last_name = "Elek",
                birth_date = "2000-01-01",
                birth_place = "Budapest",
                schools = "ELTE",
                bio = "Bio",
                avatar_url = null,
                level = 3,
                XP = 120
            }
        };

        vm.SelectedUser = user;

        Assert.That(vm.SelectedId, Is.EqualTo(7));
        Assert.That(vm.SelectedUsername, Is.EqualTo("admin"));
        Assert.That(vm.SelectedEmail, Is.EqualTo("admin@test.hu"));
        Assert.That(vm.SelectedRole, Is.EqualTo("user"));
        Assert.That(vm.SelectedCreatedAt, Is.EqualTo("2026-03-12"));
        Assert.That(vm.SelectedFirstName, Is.EqualTo("Teszt"));
        Assert.That(vm.SelectedLastName, Is.EqualTo("Elek"));
        Assert.That(vm.SelectedBirthDate, Is.EqualTo("2000-01-01"));
        Assert.That(vm.SelectedBirthPlace, Is.EqualTo("Budapest"));
        Assert.That(vm.SelectedSchools, Is.EqualTo("ELTE"));
        Assert.That(vm.SelectedBio, Is.EqualTo("Bio"));
        Assert.That(vm.SelectedLevel, Is.EqualTo("3"));
        Assert.That(vm.SelectedXp, Is.EqualTo("120"));
    }

    [Test]
    public void SearchText_FiltersUsers_ByUsername()
    {
        var vm = CreateVm();
        var allUsers = new ObservableCollection<UserModel>
        {
            new() { ID = 1, username = "adam", email = "adam@test.hu" },
            new() { ID = 2, username = "eva", email = "eva@test.hu" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allUsersBackup", allUsers);

        vm.SearchText = "adam";

        Assert.That(vm.Users.Count, Is.EqualTo(1));
        Assert.That(vm.Users[0].username, Is.EqualTo("adam"));
    }

    [Test]
    public void SearchText_FiltersUsers_ByAdvancedUsernameToken()
    {
        var vm = CreateVm();
        var allUsers = new ObservableCollection<UserModel>
        {
            new() { ID = 1, username = "adam", email = "adam@test.hu" },
            new() { ID = 2, username = "eva", email = "eva@test.hu" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allUsersBackup", allUsers);

        vm.SearchText = "@username:eva";

        Assert.That(vm.Users.Count, Is.EqualTo(1));
        Assert.That(vm.Users[0].username, Is.EqualTo("eva"));
    }

    [Test]
    public void SearchText_FiltersUsers_ByBeforeDateToken()
    {
        var vm = CreateVm();
        var allUsers = new ObservableCollection<UserModel>
        {
            new() { ID = 1, username = "old", created_at = "2024-01-01" },
            new() { ID = 2, username = "new", created_at = "2026-01-01" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allUsersBackup", allUsers);

        vm.SearchText = "@before-date:2025-01-01";

        Assert.That(vm.Users.Count, Is.EqualTo(1));
        Assert.That(vm.Users[0].username, Is.EqualTo("old"));
    }

    [Test]
    public void SearchText_Empty_RestoresAllUsers()
    {
        var vm = CreateVm();
        var allUsers = new ObservableCollection<UserModel>
        {
            new() { ID = 1, username = "adam", email = "adam@test.hu" },
            new() { ID = 2, username = "eva", email = "eva@test.hu" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allUsersBackup", allUsers);

        vm.SearchText = string.Empty;

        Assert.That(vm.Users.Count, Is.EqualTo(2));
    }

    [Test]
    public void RemoveAvatar_SetsAvatarUrlToNull_AndSuccessMessage()
    {
        var vm = CreateVm();
        vm.SelectedAvatarUrl = "http://example.com/avatar.png";

        ReflectionHelper.InvokePrivate(vm, "RemoveAvatar");

        Assert.That(vm.SelectedAvatarUrl, Is.Null);
        Assert.That(vm.SuccessMessage, Does.Contain("törlésre lett jelölve"));
        Assert.That(vm.ErrorMessage, Is.EqualTo(string.Empty));
    }
}
