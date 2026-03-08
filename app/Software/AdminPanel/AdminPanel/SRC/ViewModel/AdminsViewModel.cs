using AdminPanel.SRC.Model;
using AdminPanel.SRC.Service;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace AdminPanel.SRC.ViewModel
{
    public class AdminsViewModel : ViewModelBase
    {
        private readonly AdminApiService _adminApiService;

        public ObservableCollection<AdminUserModelWithProfile> Admins { get; set; }
        private ObservableCollection<AdminUserModelWithProfile> _allAdminsBackup;

        private AdminUserModelWithProfile? _selectedAdmin;
        public AdminUserModelWithProfile? SelectedAdmin
        {
            get => _selectedAdmin;
            set
            {
                _selectedAdmin = value;
                OnPropertyChanged(nameof(SelectedAdmin));
                LoadSelectedAdminData();
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
                FilterAdmins();
            }
        }

        private bool _isOwner;
        public bool IsOwner
        {
            get => _isOwner;
            set
            {
                _isOwner = value;
                OnPropertyChanged(nameof(IsOwner));
            }
        }

        private int _selectedId;
        public int SelectedId
        {
            get => _selectedId;
            set { _selectedId = value; OnPropertyChanged(nameof(SelectedId)); }
        }

        private string _selectedUsername = string.Empty;
        public string SelectedUsername
        {
            get => _selectedUsername;
            set { _selectedUsername = value; OnPropertyChanged(nameof(SelectedUsername)); }
        }

        private string _selectedEmail = string.Empty;
        public string SelectedEmail
        {
            get => _selectedEmail;
            set { _selectedEmail = value; OnPropertyChanged(nameof(SelectedEmail)); }
        }

        private string _selectedRole = string.Empty;
        public string SelectedRole
        {
            get => _selectedRole;
            set { _selectedRole = value; OnPropertyChanged(nameof(SelectedRole)); }
        }

        private string _selectedCreatedAt = string.Empty;
        public string SelectedCreatedAt
        {
            get => _selectedCreatedAt;
            set { _selectedCreatedAt = value; OnPropertyChanged(nameof(SelectedCreatedAt)); }
        }

        private string _targetUserId = string.Empty;
        public string TargetUserId
        {
            get => _targetUserId;
            set { _targetUserId = value; OnPropertyChanged(nameof(TargetUserId)); }
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

        public ICommand RefreshCommand { get; }
        public ICommand PromoteToAdminCommand { get; }
        public ICommand PromoteToOwnerCommand { get; }
        public ICommand DemoteToUserCommand { get; }

        public AdminsViewModel()
        {
            _adminApiService = new AdminApiService();
            Admins = new ObservableCollection<AdminUserModelWithProfile>();
            _allAdminsBackup = new ObservableCollection<AdminUserModelWithProfile>();

            RefreshCommand = new ViewModelCommand(async o => await LoadDataAsync());
            PromoteToAdminCommand = new ViewModelCommand(async o => await ChangeRoleByTargetIdAsync("admin"), o => IsOwner);
            PromoteToOwnerCommand = new ViewModelCommand(async o => await ChangeRoleByTargetIdAsync("owner"), o => IsOwner);
            DemoteToUserCommand = new ViewModelCommand(async o => await DemoteSelectedAdminToUserAsync(), o => IsOwner && SelectedAdmin != null);

            _ = LoadDataAsync();
        }

        private async Task LoadDataAsync()
        {
            try
            {
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                var currentUser = await _adminApiService.GetCurrentUserStatusAsync();
                IsOwner = currentUser?.role == "owner";

                var admins = await _adminApiService.GetAdminsAsync();

                Admins.Clear();
                _allAdminsBackup.Clear();

                if (admins != null)
                {
                    foreach (var admin in admins)
                    {
                        Admins.Add(admin);
                        _allAdminsBackup.Add(admin);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private void LoadSelectedAdminData()
        {
            if (SelectedAdmin == null)
            {
                ClearSelectedAdminData();
                return;
            }

            SelectedId = SelectedAdmin.ID;
            SelectedUsername = SelectedAdmin.username ?? string.Empty;
            SelectedEmail = SelectedAdmin.email ?? string.Empty;
            SelectedRole = SelectedAdmin.role ?? string.Empty;
            SelectedCreatedAt = SelectedAdmin.created_at ?? string.Empty;
        }

        private void ClearSelectedAdminData()
        {
            SelectedId = 0;
            SelectedUsername = string.Empty;
            SelectedEmail = string.Empty;
            SelectedRole = string.Empty;
            SelectedCreatedAt = string.Empty;
        }

        private void FilterAdmins()
        {
            var search = SearchText?.Trim().ToLower() ?? string.Empty;

            Admins.Clear();

            var filtered = string.IsNullOrWhiteSpace(search)
                ? _allAdminsBackup
                : new ObservableCollection<AdminUserModelWithProfile>(
                    _allAdminsBackup.Where(a =>
                        a.ID.ToString().Contains(search) ||
                        (a.username ?? string.Empty).ToLower().Contains(search) ||
                        (a.email ?? string.Empty).ToLower().Contains(search) ||
                        (a.role ?? string.Empty).ToLower().Contains(search)
                    ));

            foreach (var item in filtered)
            {
                Admins.Add(item);
            }
        }

        private async Task ChangeRoleByTargetIdAsync(string newRole)
        {
            try
            {
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                if (!IsOwner)
                {
                    ErrorMessage = "Ehhez owner jogosultság kell.";
                    return;
                }

                if (!int.TryParse(TargetUserId, out var userId))
                {
                    ErrorMessage = "Adj meg egy érvényes ID-t.";
                    return;
                }

                await _adminApiService.UpdateAdminRoleAsync(userId, newRole);

                SuccessMessage = $"A felhasználó role-ja sikeresen {newRole} lett.";
                TargetUserId = string.Empty;

                await LoadDataAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private async Task DemoteSelectedAdminToUserAsync()
        {
            try
            {
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                if (!IsOwner)
                {
                    ErrorMessage = "Ehhez owner jogosultság kell.";
                    return;
                }

                if (SelectedAdmin == null)
                {
                    ErrorMessage = "Nincs kiválasztott admin.";
                    return;
                }

                if (MessageBox.Show("Biztosan userré szeretnéd tenni a kiválasztott admint?",
                    "Megerősítés",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning) != MessageBoxResult.Yes)
                {
                    return;
                }

                await _adminApiService.UpdateAdminRoleAsync(SelectedAdmin.ID, "user");

                SuccessMessage = "Az admin sikeresen userré lett téve.";

                await LoadDataAsync();
                SelectedAdmin = null;
                OnPropertyChanged(nameof(SelectedAdmin));
                ClearSelectedAdminData();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }
    }
}