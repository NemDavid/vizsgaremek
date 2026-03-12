using System.Collections.ObjectModel;
using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using AdminPanel.Tests.Helpers;
using NUnit.Framework;

namespace AdminPanel.Tests.ViewModels;

[TestFixture]
public class AdsViewModelTests
{
    private static AdsViewModel CreateVm()
    {
        var vm = ReflectionHelper.CreateWithoutConstructor<AdsViewModel>();

        vm.Advertisements = new ObservableCollection<AdvertisementModel>();
        ReflectionHelper.SetPrivateField(vm, "_allAdvertisementsBackup", new ObservableCollection<AdvertisementModel>());
        ReflectionHelper.SetPrivateField(vm, "_searchText", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_errorMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_successMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_newTitle", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_newSubject", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_newImagePath", string.Empty);

        return vm;
    }

    [Test]
    public void SelectedAdvertisement_LoadsSelectedFields()
    {
        var vm = CreateVm();
        var ad = new AdvertisementModel
        {
            ID = 4,
            title = "Sale",
            subject = "Big sale",
            created_at = "2026-03-12",
            imagePath = null
        };

        vm.SelectedAdvertisement = ad;

        Assert.That(vm.SelectedId, Is.EqualTo(4));
        Assert.That(vm.SelectedTitle, Is.EqualTo("Sale"));
        Assert.That(vm.SelectedSubject, Is.EqualTo("Big sale"));
        Assert.That(vm.SelectedCreatedAt, Is.EqualTo("2026-03-12"));
    }

    [Test]
    public void SearchText_FiltersAdvertisements_ByTitle()
    {
        var vm = CreateVm();
        var allAds = new ObservableCollection<AdvertisementModel>
        {
            new() { ID = 1, title = "Nike", subject = "Shoes" },
            new() { ID = 2, title = "Apple", subject = "Phone" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allAdvertisementsBackup", allAds);

        vm.SearchText = "nike";

        Assert.That(vm.Advertisements.Count, Is.EqualTo(1));
        Assert.That(vm.Advertisements[0].title, Is.EqualTo("Nike"));
    }

    [Test]
    public void SearchText_FiltersAdvertisements_BySubject()
    {
        var vm = CreateVm();
        var allAds = new ObservableCollection<AdvertisementModel>
        {
            new() { ID = 1, title = "Nike", subject = "Shoes" },
            new() { ID = 2, title = "Apple", subject = "Phone" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allAdvertisementsBackup", allAds);

        vm.SearchText = "phone";

        Assert.That(vm.Advertisements.Count, Is.EqualTo(1));
        Assert.That(vm.Advertisements[0].title, Is.EqualTo("Apple"));
    }

    [Test]
    public void SearchText_Empty_RestoresAllAdvertisements()
    {
        var vm = CreateVm();
        var allAds = new ObservableCollection<AdvertisementModel>
        {
            new() { ID = 1, title = "Nike", subject = "Shoes" },
            new() { ID = 2, title = "Apple", subject = "Phone" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allAdvertisementsBackup", allAds);

        vm.SearchText = string.Empty;

        Assert.That(vm.Advertisements.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task CreateAdvertisementAsync_SetsError_WhenTitleOrSubjectMissing()
    {
        var vm = CreateVm();
        vm.NewTitle = string.Empty;
        vm.NewSubject = "Subject";

        await ReflectionHelper.InvokePrivateAsync(vm, "CreateAdvertisementAsync");

        Assert.That(vm.ErrorMessage, Is.EqualTo("A title és a subject kötelező."));
    }
}
