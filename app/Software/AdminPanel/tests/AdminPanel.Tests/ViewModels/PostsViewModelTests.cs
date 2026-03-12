using System.Collections.ObjectModel;
using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using AdminPanel.Tests.Helpers;
using NUnit.Framework;

namespace AdminPanel.Tests.ViewModels;

[TestFixture]
public class PostsViewModelTests
{
    private static PostsViewModel CreateVm()
    {
        var vm = ReflectionHelper.CreateWithoutConstructor<PostsViewModel>();

        vm.Posts = new ObservableCollection<PostModel>();
        vm.Comments = new ObservableCollection<PostCommentModel>();
        ReflectionHelper.SetPrivateField(vm, "_allPostsBackup", new ObservableCollection<PostModel>());
        ReflectionHelper.SetPrivateField(vm, "_searchText", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_errorMessage", string.Empty);
        ReflectionHelper.SetPrivateField(vm, "_successMessage", string.Empty);

        return vm;
    }

    [Test]
    public void SelectedPost_LoadsSelectedFieldsAndComments()
    {
        var vm = CreateVm();
        var post = new PostModel
        {
            ID = 10,
            title = "Hello",
            content = "World",
            created_at = "2026-03-12",
            updated_at = "2026-03-13",
            media_url = null,
            comments =
            [
                new PostCommentModel { ID = 1, comment = "Első komment" },
                new PostCommentModel { ID = 2, comment = "Második komment" }
            ]
        };

        vm.SelectedPost = post;

        Assert.That(vm.SelectedPostId, Is.EqualTo(10));
        Assert.That(vm.SelectedPostTitle, Is.EqualTo("Hello"));
        Assert.That(vm.SelectedPostContent, Is.EqualTo("World"));
        Assert.That(vm.SelectedPostCreatedAt, Is.EqualTo("2026-03-12"));
        Assert.That(vm.SelectedPostUpdatedAt, Is.EqualTo("2026-03-13"));
        Assert.That(vm.Comments.Count, Is.EqualTo(2));
    }

    [Test]
    public void SearchText_FiltersPosts_ByTitle()
    {
        var vm = CreateVm();
        var allPosts = new ObservableCollection<PostModel>
        {
            new() { ID = 1, title = "Cica poszt", content = "alma" },
            new() { ID = 2, title = "Kutya poszt", content = "körte" },
            new() { ID = 3, title = "Madár", content = "szilva" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allPostsBackup", allPosts);

        vm.SearchText = "kutya";

        Assert.That(vm.Posts.Count, Is.EqualTo(1));
        Assert.That(vm.Posts[0].ID, Is.EqualTo(2));
    }

    [Test]
    public void SearchText_FiltersPosts_ByContent()
    {
        var vm = CreateVm();
        var allPosts = new ObservableCollection<PostModel>
        {
            new() { ID = 1, title = "A", content = "almafa" },
            new() { ID = 2, title = "B", content = "körtefa" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allPostsBackup", allPosts);

        vm.SearchText = "körte";

        Assert.That(vm.Posts.Count, Is.EqualTo(1));
        Assert.That(vm.Posts[0].ID, Is.EqualTo(2));
    }

    [Test]
    public void SearchText_Empty_RestoresAllPosts()
    {
        var vm = CreateVm();
        var allPosts = new ObservableCollection<PostModel>
        {
            new() { ID = 1, title = "Első", content = "a" },
            new() { ID = 2, title = "Második", content = "b" }
        };

        ReflectionHelper.SetPrivateField(vm, "_allPostsBackup", allPosts);

        vm.SearchText = string.Empty;

        Assert.That(vm.Posts.Count, Is.EqualTo(2));
    }

    [Test]
    public void SelectedPost_Null_ClearsSelectedFields()
    {
        var vm = CreateVm();
        vm.SelectedPost = new PostModel
        {
            ID = 1,
            title = "Teszt",
            content = "Tartalom",
            comments = [new PostCommentModel { ID = 1, comment = "Komment" }]
        };

        vm.SelectedPost = null;

        Assert.That(vm.SelectedPostId, Is.EqualTo(0));
        Assert.That(vm.SelectedPostTitle, Is.EqualTo(string.Empty));
        Assert.That(vm.SelectedPostContent, Is.EqualTo(string.Empty));
        Assert.That(vm.SelectedMediaUrl, Is.EqualTo(string.Empty));
        Assert.That(vm.Comments.Count, Is.EqualTo(0));
        Assert.That(vm.SelectedComment, Is.Null);
    }
}
