using AdminPanel.SRC.Model;
using AdminPanel.SRC.Service;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace AdminPanel.SRC.ViewModel
{
    public class UsersViewModel : ViewModelBase
    {
        private readonly UserApiService _userApiService;

        public ObservableCollection<UserModel> Users { get; set; }

        private UserModel? _selectedUser;
        public UserModel? SelectedUser
        {
            get => _selectedUser;
            set
            {
                _selectedUser = value;
                OnPropertyChanged(nameof(SelectedUser));
                LoadSelectedUserData();
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
                FilterUsers();
            }
        }

        private ObservableCollection<UserModel> _allUsersBackup;

        private int _selectedId;
        public int SelectedId
        {
            get => _selectedId;
            set { _selectedId = value; OnPropertyChanged(nameof(SelectedId)); }
        }

        private string _selectedEmail = string.Empty;
        public string SelectedEmail
        {
            get => _selectedEmail;
            set { _selectedEmail = value; OnPropertyChanged(nameof(SelectedEmail)); }
        }

        private string _selectedUsername = string.Empty;
        public string SelectedUsername
        {
            get => _selectedUsername;
            set { _selectedUsername = value; OnPropertyChanged(nameof(SelectedUsername)); }
        }

        private string _selectedPassword = string.Empty;
        public string SelectedPassword
        {
            get => _selectedPassword;
            set { _selectedPassword = value; OnPropertyChanged(nameof(SelectedPassword)); }
        }

        private string _selectedFirstName = string.Empty;
        public string SelectedFirstName
        {
            get => _selectedFirstName;
            set { _selectedFirstName = value; OnPropertyChanged(nameof(SelectedFirstName)); }
        }

        private string _selectedLastName = string.Empty;
        public string SelectedLastName
        {
            get => _selectedLastName;
            set { _selectedLastName = value; OnPropertyChanged(nameof(SelectedLastName)); }
        }

        private string _selectedBirthDate = string.Empty;
        public string SelectedBirthDate
        {
            get => _selectedBirthDate;
            set { _selectedBirthDate = value; OnPropertyChanged(nameof(SelectedBirthDate)); }
        }

        private string _selectedBirthPlace = string.Empty;
        public string SelectedBirthPlace
        {
            get => _selectedBirthPlace;
            set { _selectedBirthPlace = value; OnPropertyChanged(nameof(SelectedBirthPlace)); }
        }

        private string _selectedSchools = string.Empty;
        public string SelectedSchools
        {
            get => _selectedSchools;
            set { _selectedSchools = value; OnPropertyChanged(nameof(SelectedSchools)); }
        }

        private string _selectedBio = string.Empty;
        public string SelectedBio
        {
            get => _selectedBio;
            set { _selectedBio = value; OnPropertyChanged(nameof(SelectedBio)); }
        }

        private string _selectedAvatarUrl = string.Empty;
        public string SelectedAvatarUrl
        {
            get => _selectedAvatarUrl;
            set { _selectedAvatarUrl = value; OnPropertyChanged(nameof(SelectedAvatarUrl)); }
        }

        private string _selectedCreatedAt = string.Empty;
        public string SelectedCreatedAt
        {
            get => _selectedCreatedAt;
            set { _selectedCreatedAt = value; OnPropertyChanged(nameof(SelectedCreatedAt)); }
        }

        private string _selectedRole = string.Empty;
        public string SelectedRole
        {
            get => _selectedRole;
            set { _selectedRole = value; OnPropertyChanged(nameof(SelectedRole)); }
        }

        private string _selectedLevel = string.Empty;
        public string SelectedLevel
        {
            get => _selectedLevel;
            set { _selectedLevel = value; OnPropertyChanged(nameof(SelectedLevel)); }
        }

        private string _selectedXp = string.Empty;
        public string SelectedXp
        {
            get => _selectedXp;
            set { _selectedXp = value; OnPropertyChanged(nameof(SelectedXp)); }
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
        public ICommand DeleteUserCommand { get; }
        public ICommand SaveUserCommand { get; }

        public UsersViewModel()
        {
            _userApiService = new UserApiService();
            Users = new ObservableCollection<UserModel>();
            _allUsersBackup = new ObservableCollection<UserModel>();

            RefreshCommand = new ViewModelCommand(async o => await LoadUsersAsync());
            DeleteUserCommand = new ViewModelCommand(async o => await DeleteSelectedUserAsync(), o => SelectedUser != null);
            SaveUserCommand = new ViewModelCommand(async o => await SaveSelectedUserAsync(), o => SelectedUser != null);

            _ = LoadUsersAsync();
        }

        private async System.Threading.Tasks.Task LoadUsersAsync()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                var result = await _userApiService.GetAllUsersAsync();

                Users.Clear();
                _allUsersBackup.Clear();

                if (result != null)
                {
                    foreach (var user in result)
                    {
                        Users.Add(user);
                        _allUsersBackup.Add(user);
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

        private void LoadSelectedUserData()
        {
            if (SelectedUser == null)
            {
                ClearSelectedUserData();
                return;
            }

            SelectedId = SelectedUser.id;
            SelectedEmail = SelectedUser.email ?? string.Empty;
            SelectedUsername = SelectedUser.username ?? string.Empty;
            SelectedPassword = string.Empty;
            SelectedCreatedAt = SelectedUser.created_at ?? string.Empty;
            SelectedRole = SelectedUser.role ?? string.Empty;

            SelectedFirstName = SelectedUser.Profile?.first_name ?? string.Empty;
            SelectedLastName = SelectedUser.Profile?.last_name ?? string.Empty;
            SelectedBirthDate = SelectedUser.Profile?.birth_date ?? string.Empty;
            SelectedBirthPlace = SelectedUser.Profile?.birth_place ?? string.Empty;
            SelectedSchools = SelectedUser.Profile?.schools ?? string.Empty;
            SelectedBio = SelectedUser.Profile?.bio ?? string.Empty;
            SelectedAvatarUrl = SelectedUser.Profile?.avatar_url ?? string.Empty;
            SelectedLevel = SelectedUser.Profile?.level?.ToString() ?? string.Empty;
            SelectedXp = SelectedUser.Profile?.XP?.ToString() ?? string.Empty;
        }

        private void ClearSelectedUserData()
        {
            SelectedId = 0;
            SelectedEmail = string.Empty;
            SelectedUsername = string.Empty;
            SelectedPassword = string.Empty;
            SelectedCreatedAt = string.Empty;
            SelectedRole = string.Empty;
            SelectedFirstName = string.Empty;
            SelectedLastName = string.Empty;
            SelectedBirthDate = string.Empty;
            SelectedBirthPlace = string.Empty;
            SelectedSchools = string.Empty;
            SelectedBio = string.Empty;
            SelectedAvatarUrl = string.Empty;
            SelectedLevel = string.Empty;
            SelectedXp = string.Empty;
        }

        private void FilterUsers()
        {
            if (_allUsersBackup == null)
                return;

            var search = SearchText?.Trim() ?? string.Empty;

            Users.Clear();

            if (string.IsNullOrWhiteSpace(search))
            {
                foreach (var user in _allUsersBackup)
                    Users.Add(user);

                return;
            }

            var tokens = search.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var filtered = _allUsersBackup.Where(user =>
            {
                foreach (var token in tokens)
                {
                    if (token.StartsWith("@"))
                    {
                        if (!MatchesAdvancedFilter(user, token))
                            return false;
                    }
                    else
                    {
                        var normal = token.ToLower();

                        bool normalMatch =
                            user.id.ToString().Contains(normal) ||
                            (user.username ?? string.Empty).ToLower().Contains(normal) ||
                            (user.email ?? string.Empty).ToLower().Contains(normal) ||
                            (user.role ?? string.Empty).ToLower().Contains(normal) ||
                            (user.Profile?.first_name ?? string.Empty).ToLower().Contains(normal) ||
                            (user.Profile?.last_name ?? string.Empty).ToLower().Contains(normal);

                        if (!normalMatch)
                            return false;
                    }
                }

                return true;
            });

            foreach (var user in filtered)
                Users.Add(user);
        }
        private bool MatchesAdvancedFilter(UserModel user, string token)
        {
            var raw = token.Substring(1); // leveszi a @ jelet
            var parts = raw.Split(':', 2);

            if (parts.Length != 2)
                return true; // ha hibás a formátum, ne dobja szét teljesen a keresést

            var key = parts[0].Trim().ToLower();
            var value = parts[1].Trim().ToLower();

            switch (key)
            {
                case "id":
                    return user.id.ToString().Contains(value);

                case "username":
                    return (user.username ?? string.Empty).ToLower().Contains(value);

                case "email":
                    return (user.email ?? string.Empty).ToLower().Contains(value);

                case "firstname":
                    return (user.Profile?.first_name ?? string.Empty).ToLower().Contains(value);

                case "lastname":
                    return (user.Profile?.last_name ?? string.Empty).ToLower().Contains(value);

                case "role":
                    return (user.role ?? string.Empty).ToLower().Contains(value);

                case "birthplace":
                    return (user.Profile?.birth_place ?? string.Empty).ToLower().Contains(value);

                case "school":
                case "schools":
                    return (user.Profile?.schools ?? string.Empty).ToLower().Contains(value);

                case "before-date":
                    return CompareCreatedAt(user.created_at, value, before: true);

                case "after-date":
                    return CompareCreatedAt(user.created_at, value, before: false);

                default:
                    return true;
            }
        }
        private bool CompareCreatedAt(string? createdAt, string filterDate, bool before)
        {
            if (string.IsNullOrWhiteSpace(createdAt))
                return false;

            if (!DateTime.TryParse(createdAt, out var createdDate))
                return false;

            if (!DateTime.TryParse(filterDate, out var targetDate))
                return false;

            return before
                ? createdDate.Date < targetDate.Date
                : createdDate.Date > targetDate.Date;
        }
        private async System.Threading.Tasks.Task SaveSelectedUserAsync()
        {
            try
            {
                if (SelectedUser == null)
                    return;

                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                if (string.IsNullOrWhiteSpace(SelectedEmail) ||
                    string.IsNullOrWhiteSpace(SelectedUsername))
                {
                    ErrorMessage = "Az email és a username kötelező.";
                    return;
                }

                await _userApiService.UpdateUserAsync(
                    SelectedId,
                    SelectedEmail,
                    SelectedPassword,
                    SelectedUsername
                );

                await _userApiService.UpdateProfileAsync(
                    SelectedId,
                    SelectedFirstName,
                    SelectedLastName,
                    SelectedBirthDate,
                    SelectedBirthPlace,
                    SelectedSchools,
                    SelectedBio
                );

                SuccessMessage = "Felhasználó sikeresen frissítve.";
                await LoadUsersAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private async System.Threading.Tasks.Task DeleteSelectedUserAsync()
        {
            try
            {
                if (SelectedUser == null)
                    return;

                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                await _userApiService.DeleteUserAsync(SelectedId);

                SuccessMessage = "Felhasználó sikeresen törölve.";

                await LoadUsersAsync();
                SelectedUser = null;
                OnPropertyChanged(nameof(SelectedUser));
                ClearSelectedUserData();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }
    }
}
