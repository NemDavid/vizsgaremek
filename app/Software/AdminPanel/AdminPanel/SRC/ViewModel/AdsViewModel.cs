using AdminPanel.SRC.Model;
using AdminPanel.SRC.Service;
using Microsoft.Win32;
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
    public class AdsViewModel : ViewModelBase
    {
        private readonly AdvertisementApiService _advertisementApiService;

        public ObservableCollection<AdvertisementModel> Advertisements { get; set; }

        private ObservableCollection<AdvertisementModel> _allAdvertisementsBackup;

        private AdvertisementModel? _selectedAdvertisement;
        public AdvertisementModel? SelectedAdvertisement
        {
            get => _selectedAdvertisement;
            set
            {
                _selectedAdvertisement = value;
                OnPropertyChanged(nameof(SelectedAdvertisement));
                LoadSelectedAdvertisementData();
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
                FilterAdvertisements();
            }
        }

        private int _selectedId;
        public int SelectedId
        {
            get => _selectedId;
            set { _selectedId = value; OnPropertyChanged(nameof(SelectedId)); }
        }

        private string _selectedTitle = string.Empty;
        public string SelectedTitle
        {
            get => _selectedTitle;
            set { _selectedTitle = value; OnPropertyChanged(nameof(SelectedTitle)); }
        }

        private string _selectedSubject = string.Empty;
        public string SelectedSubject
        {
            get => _selectedSubject;
            set { _selectedSubject = value; OnPropertyChanged(nameof(SelectedSubject)); }
        }

        private string _selectedCreatedAt = string.Empty;
        public string SelectedCreatedAt
        {
            get => _selectedCreatedAt;
            set { _selectedCreatedAt = value; OnPropertyChanged(nameof(SelectedCreatedAt)); }
        }

        private string? _selectedImageUrl = string.Empty;
        public string? SelectedImageUrl
        {
            get => _selectedImageUrl;
            set { _selectedImageUrl = value; OnPropertyChanged(nameof(SelectedImageUrl)); }
        }

        private BitmapImage? _selectedImage;
        public BitmapImage? SelectedImage
        {
            get => _selectedImage;
            set { _selectedImage = value; OnPropertyChanged(nameof(SelectedImage)); }
        }

        private string _newTitle = string.Empty;
        public string NewTitle
        {
            get => _newTitle;
            set { _newTitle = value; OnPropertyChanged(nameof(NewTitle)); }
        }

        private string _newSubject = string.Empty;
        public string NewSubject
        {
            get => _newSubject;
            set { _newSubject = value; OnPropertyChanged(nameof(NewSubject)); }
        }

        private string _newImagePath = string.Empty;
        public string NewImagePath
        {
            get => _newImagePath;
            set { _newImagePath = value; OnPropertyChanged(nameof(NewImagePath)); }
        }

        private BitmapImage? _newImagePreview;
        public BitmapImage? NewImagePreview
        {
            get => _newImagePreview;
            set { _newImagePreview = value; OnPropertyChanged(nameof(NewImagePreview)); }
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
        public ICommand DeleteAdvertisementCommand { get; }
        public ICommand CreateAdvertisementCommand { get; }
        public ICommand SelectImageCommand { get; }

        public AdsViewModel()
        {
            _advertisementApiService = new AdvertisementApiService();
            Advertisements = new ObservableCollection<AdvertisementModel>();
            _allAdvertisementsBackup = new ObservableCollection<AdvertisementModel>();

            RefreshCommand = new ViewModelCommand(async o => await LoadAdvertisementsAsync());
            DeleteAdvertisementCommand = new ViewModelCommand(async o => await DeleteSelectedAdvertisementAsync(), o => SelectedAdvertisement != null);
            CreateAdvertisementCommand = new ViewModelCommand(async o => await CreateAdvertisementAsync());
            SelectImageCommand = new ViewModelCommand(o => SelectImage());

            _ = LoadAdvertisementsAsync();
        }

        private async Task LoadAdvertisementsAsync()
        {
            try
            {
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                var result = await _advertisementApiService.GetAllAdvertisementsAsync();

                Advertisements.Clear();
                _allAdvertisementsBackup.Clear();

                if (result != null)
                {
                    foreach (var item in result)
                    {
                        Advertisements.Add(item);
                        _allAdvertisementsBackup.Add(item);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private void FilterAdvertisements()
        {
            var search = SearchText?.Trim().ToLower() ?? string.Empty;

            Advertisements.Clear();

            var filtered = string.IsNullOrWhiteSpace(search)
                ? _allAdvertisementsBackup
                : new ObservableCollection<AdvertisementModel>(
                    _allAdvertisementsBackup.Where(a =>
                        a.ID.ToString().Contains(search) ||
                        (a.title ?? string.Empty).ToLower().Contains(search) ||
                        (a.subject ?? string.Empty).ToLower().Contains(search)
                    ));

            foreach (var item in filtered)
                Advertisements.Add(item);
        }

        private void LoadSelectedAdvertisementData()
        {
            if (SelectedAdvertisement == null)
            {
                ClearSelectedAdvertisementData();
                return;
            }

            SelectedId = SelectedAdvertisement.ID;
            SelectedTitle = SelectedAdvertisement.title ?? string.Empty;
            SelectedSubject = SelectedAdvertisement.subject ?? string.Empty;
            SelectedCreatedAt = SelectedAdvertisement.created_at ?? string.Empty;
            SelectedImageUrl = SelectedAdvertisement.imagePath ?? string.Empty;

            _ = LoadSelectedImageAsync();
        }

        private void ClearSelectedAdvertisementData()
        {
            SelectedId = 0;
            SelectedTitle = string.Empty;
            SelectedSubject = string.Empty;
            SelectedCreatedAt = string.Empty;
            SelectedImageUrl = string.Empty;
            SelectedImage = null;
        }

        private void SelectImage()
        {
            var dialog = new OpenFileDialog
            {
                Filter = "Képek|*.png;*.jpg;*.jpeg;*.webp"
            };

            if (dialog.ShowDialog() == true)
            {
                NewImagePath = dialog.FileName;

                try
                {
                    NewImagePreview = new BitmapImage(new Uri(NewImagePath, UriKind.Absolute));
                }
                catch
                {
                    NewImagePreview = null;
                }
            }
        }

        private async Task LoadSelectedImageAsync()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(SelectedImageUrl))
                {
                    SelectedImage = null;
                    return;
                }

                using var response = await ApiClient.Client.GetAsync(SelectedImageUrl);
                if (!response.IsSuccessStatusCode)
                {
                    SelectedImage = null;
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

                SelectedImage = image;
            }
            catch
            {
                SelectedImage = null;
            }
        }

        private async Task CreateAdvertisementAsync()
        {
            try
            {
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                if (string.IsNullOrWhiteSpace(NewTitle) || string.IsNullOrWhiteSpace(NewSubject))
                {
                    ErrorMessage = "A title és a subject kötelező.";
                    return;
                }

                await _advertisementApiService.CreateAdvertisementAsync(NewTitle, NewSubject, NewImagePath);

                SuccessMessage = "Hirdetés sikeresen létrehozva.";

                NewTitle = string.Empty;
                NewSubject = string.Empty;
                NewImagePath = string.Empty;
                NewImagePreview = null;

                await LoadAdvertisementsAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }

        private async Task DeleteSelectedAdvertisementAsync()
        {
            try
            {
                if (SelectedAdvertisement == null)
                    return;

                if (MessageBox.Show("Biztosan törölni szeretnéd ezt a hirdetést?",
                    "Megerősítés",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning) != MessageBoxResult.Yes)
                {
                    return;
                }

                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                await _advertisementApiService.DeleteAdvertisementAsync(SelectedId);

                SuccessMessage = "Hirdetés sikeresen törölve.";

                await LoadAdvertisementsAsync();
                SelectedAdvertisement = null;
                OnPropertyChanged(nameof(SelectedAdvertisement));
                ClearSelectedAdvertisementData();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }
    }
}