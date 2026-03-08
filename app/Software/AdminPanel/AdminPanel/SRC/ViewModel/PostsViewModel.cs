using AdminPanel.SRC.Model;
using AdminPanel.SRC.Service;
using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media.Imaging;

namespace AdminPanel.SRC.ViewModel
{
    public class PostsViewModel : ViewModelBase
    {
        private readonly PostApiService _postApiService;

        public ObservableCollection<PostModel> Posts { get; set; }
        public ObservableCollection<PostCommentModel> Comments { get; set; }

        private ObservableCollection<PostModel> _allPostsBackup;

        private PostModel? _selectedPost;
        public PostModel? SelectedPost
        {
            get => _selectedPost;
            set
            {
                _selectedPost = value;
                OnPropertyChanged(nameof(SelectedPost));
                LoadSelectedPostData();
            }
        }

        private PostCommentModel? _selectedComment;
        public PostCommentModel? SelectedComment
        {
            get => _selectedComment;
            set
            {
                _selectedComment = value;
                OnPropertyChanged(nameof(SelectedComment));
            }
        }

        private string _searchText = string.Empty;
        public string SearchText
        {
            get => _searchText;
            set
            {
                _searchText = value;
                OnPropertyChanged(nameof(SearchText));
                FilterPosts();
            }
        }

        private int _selectedPostId;
        public int SelectedPostId
        {
            get => _selectedPostId;
            set { _selectedPostId = value; OnPropertyChanged(nameof(SelectedPostId)); }
        }

        private string _selectedPostTitle = string.Empty;
        public string SelectedPostTitle
        {
            get => _selectedPostTitle;
            set { _selectedPostTitle = value; OnPropertyChanged(nameof(SelectedPostTitle)); }
        }

        private string _selectedPostContent = string.Empty;
        public string SelectedPostContent
        {
            get => _selectedPostContent;
            set { _selectedPostContent = value; OnPropertyChanged(nameof(SelectedPostContent)); }
        }

        private string _selectedPostCreatedAt = string.Empty;
        public string SelectedPostCreatedAt
        {
            get => _selectedPostCreatedAt;
            set { _selectedPostCreatedAt = value; OnPropertyChanged(nameof(SelectedPostCreatedAt)); }
        }

        private string _selectedPostUpdatedAt = string.Empty;
        public string SelectedPostUpdatedAt
        {
            get => _selectedPostUpdatedAt;
            set { _selectedPostUpdatedAt = value; OnPropertyChanged(nameof(SelectedPostUpdatedAt)); }
        }

        private string? _selectedMediaUrl = string.Empty;
        public string? SelectedMediaUrl
        {
            get => _selectedMediaUrl;
            set { _selectedMediaUrl = value; OnPropertyChanged(nameof(SelectedMediaUrl)); }
        }

        private BitmapImage? _selectedPostImage;
        public BitmapImage? SelectedPostImage
        {
            get => _selectedPostImage;
            set
            {
                _selectedPostImage = value;
                OnPropertyChanged(nameof(SelectedPostImage));
            }
        }

        private string _errorMessage = string.Empty;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(nameof(ErrorMessage)); }
        }

        private string _successMessage = string.Empty;
        public string SuccessMessage
        {
            get => _successMessage;
            set { _successMessage = value; OnPropertyChanged(nameof(SuccessMessage)); }
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set { _isLoading = value; OnPropertyChanged(nameof(IsLoading)); }
        }

        public ICommand RefreshCommand { get; }
        public ICommand DeletePostCommand { get; }
        public ICommand DeleteCommentCommand { get; }

        public PostsViewModel()
        {
            _postApiService = new PostApiService();
            Posts = new ObservableCollection<PostModel>();
            Comments = new ObservableCollection<PostCommentModel>();
            _allPostsBackup = new ObservableCollection<PostModel>();

            RefreshCommand = new ViewModelCommand(async o => await LoadPostsAsync());
            DeletePostCommand = new ViewModelCommand(async o => await DeleteSelectedPostAsync(), o => SelectedPost != null);
            DeleteCommentCommand = new ViewModelCommand(async o => await DeleteSelectedCommentAsync(), o => SelectedComment != null);

            _ = LoadPostsAsync();
        }

        private async Task LoadPostsAsync()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                var result = await _postApiService.GetAllPostsAsync();

                Posts.Clear();
                _allPostsBackup.Clear();

                if (result != null)
                {
                    foreach (var post in result)
                    {
                        Posts.Add(post);
                        _allPostsBackup.Add(post);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                IsLoading = false;
            }
        }

        private void FilterPosts()
        {
            var search = SearchText?.Trim().ToLower() ?? string.Empty;

            Posts.Clear();

            var filtered = string.IsNullOrWhiteSpace(search)
                ? _allPostsBackup
                : new ObservableCollection<PostModel>(
                    _allPostsBackup.Where(p =>
                        p.ID.ToString().Contains(search) ||
                        (p.title ?? string.Empty).ToLower().Contains(search) ||
                        (p.content ?? string.Empty).ToLower().Contains(search)
                    ));

            foreach (var post in filtered)
                Posts.Add(post);
        }

        private void LoadSelectedPostData()
        {
            if (SelectedPost == null)
            {
                ClearSelectedPostData();
                return;
            }

            SelectedPostId = SelectedPost.ID;
            SelectedPostTitle = SelectedPost.title ?? string.Empty;
            SelectedPostContent = SelectedPost.content ?? string.Empty;
            SelectedPostCreatedAt = SelectedPost.created_at ?? string.Empty;
            SelectedPostUpdatedAt = SelectedPost.updated_at ?? string.Empty;
            SelectedMediaUrl = SelectedPost.media_url ?? string.Empty;

            Comments.Clear();

            if (SelectedPost.comments != null)
            {
                foreach (var comment in SelectedPost.comments)
                    Comments.Add(comment);
            }

            _ = LoadPostImageAsync();
        }

        private void ClearSelectedPostData()
        {
            SelectedPostId = 0;
            SelectedPostTitle = string.Empty;
            SelectedPostContent = string.Empty;
            SelectedPostCreatedAt = string.Empty;
            SelectedPostUpdatedAt = string.Empty;
            SelectedMediaUrl = string.Empty;
            SelectedPostImage = null;
            SelectedComment = null;
            Comments.Clear();
        }

        private async Task LoadPostImageAsync()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(SelectedMediaUrl))
                {
                    SelectedPostImage = null;
                    return;
                }

                using var response = await ApiClient.Client.GetAsync(SelectedMediaUrl);
                if (!response.IsSuccessStatusCode)
                {
                    SelectedPostImage = null;
                    return;
                }

                await using var stream = await response.Content.ReadAsStreamAsync();
                using var memory = new MemoryStream();
                await stream.CopyToAsync(memory);
                memory.Position = 0;

                var image = new BitmapImage();
                image.BeginInit();
                image.CacheOption = BitmapCacheOption.OnLoad;
                image.StreamSource = memory;
                image.EndInit();
                image.Freeze();

                SelectedPostImage = image;
            }
            catch
            {
                SelectedPostImage = null;
            }
        }

        private async Task DeleteSelectedPostAsync()
        {
            try
            {
                if (SelectedPost == null)
                    return;

                if (MessageBox.Show("Biztosan törölni szeretnéd ezt a posztot?",
                    "Megerősítés",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning) != MessageBoxResult.Yes)
                {
                    return;
                }

                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                await _postApiService.DeletePostAsync(SelectedPostId);

                SuccessMessage = "Poszt sikeresen törölve.";

                await LoadPostsAsync();
                SelectedPost = null;
                OnPropertyChanged(nameof(SelectedPost));
                ClearSelectedPostData();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private async Task DeleteSelectedCommentAsync()
        {
            try
            {
                if (SelectedComment == null || SelectedPost == null)
                    return;

                if (MessageBox.Show("Biztosan törölni szeretnéd ezt a kommentet?",
                    "Megerősítés",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning) != MessageBoxResult.Yes)
                {
                    return;
                }

                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                await _postApiService.DeleteCommentAsync(SelectedComment.ID);

                SuccessMessage = "Komment sikeresen törölve.";

                var refreshedComments = await _postApiService.GetCommentsForPostAsync(SelectedPostId);

                Comments.Clear();
                if (refreshedComments != null)
                {
                    foreach (var comment in refreshedComments)
                        Comments.Add(comment);
                }

                SelectedComment = null;
                OnPropertyChanged(nameof(SelectedComment));
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }
    }
}