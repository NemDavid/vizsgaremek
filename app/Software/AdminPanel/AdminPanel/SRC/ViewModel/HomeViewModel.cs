using AdminPanel.SRC.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.ViewModel
{
    public class HomeViewModel : ViewModelBase
    {
        private readonly AdminApiService _adminApiService;

        private int _usersCount;
        private int _postsCount;
        private int _adsCount;
        private bool _isLoading;
        private string _errorMessage = string.Empty;

        public int UsersCount
        {
            get => _usersCount;
            set
            {
                _usersCount = value;
                OnPropertyChanged(nameof(UsersCount));
            }
        }

        public int PostsCount
        {
            get => _postsCount;
            set
            {
                _postsCount = value;
                OnPropertyChanged(nameof(PostsCount));
            }
        }

        public int AdsCount
        {
            get => _adsCount;
            set
            {
                _adsCount = value;
                OnPropertyChanged(nameof(AdsCount));
            }
        }

        public bool IsLoading
        {
            get => _isLoading;
            set
            {
                _isLoading = value;
                OnPropertyChanged(nameof(IsLoading));
            }
        }

        public string ErrorMessage
        {
            get => _errorMessage;
            set
            {
                _errorMessage = value;
                OnPropertyChanged(nameof(ErrorMessage));
            }
        }

        public HomeViewModel()
        {
            _adminApiService = new AdminApiService();
            _ = LoadAdminInfoAsync();
        }

        private async Task LoadAdminInfoAsync()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var result = await _adminApiService.GetAdminInfoAsync();

                if (result != null)
                {
                    UsersCount = result.users;
                    PostsCount = result.posts;
                    AdsCount = result.ads;
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
    }
}
