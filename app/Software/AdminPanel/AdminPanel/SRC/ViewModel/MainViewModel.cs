using FontAwesome.Sharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace AdminPanel.SRC.ViewModel
{
    public class MainViewModel : ViewModelBase
    {
        //Fields
        private ViewModelBase _currentChildView;
        private string _caption;
        private IconChar _icon;
        public ViewModelBase CurrentChildView
        {
            get
            {
                return _currentChildView;
            }
            set
            {
                _currentChildView = value;
                OnPropertyChanged(nameof(CurrentChildView));
            }
        }
        public string Caption
        {
            get
            {
                return _caption;
            }
            set
            {
                _caption = value;
                OnPropertyChanged(nameof(Caption));
            }
        }
        public IconChar Icon
        {
            get
            {
                return _icon;
            }
            set
            {
                _icon = value;
                OnPropertyChanged(nameof(Icon));
            }
        }
        //--> Commands
        public ICommand ShowHomeViewCommand { get; }
        public ICommand ShowUserViewCommand { get; }
        public ICommand ShowShowPostViewCommand { get; }
        public ICommand ShowShowAdsViewCommand { get; }
        public ICommand ShowShowAdminsViewCommand { get; }
        public MainViewModel()
        {

            //Initialize commands
            ShowHomeViewCommand = new ViewModelCommand(ExecuteShowHomeViewCommand);
            ShowUserViewCommand = new ViewModelCommand(ExecuteShowUsersViewCommand);
            ShowShowPostViewCommand = new ViewModelCommand(ExecuteShowPostViewCommand);
            ShowShowAdsViewCommand = new ViewModelCommand(ExecuteShowAdsViewCommand);
            ShowShowAdminsViewCommand = new ViewModelCommand(ExecuteShowAdminsViewCommand);
            //Default view
            ExecuteShowHomeViewCommand(null);
        }
        private void ExecuteShowUsersViewCommand(object obj)
        {
            CurrentChildView = new UsersViewModel();
            Caption = "Felhasználók";
            Icon = IconChar.UserGroup;
        }
        private void ExecuteShowHomeViewCommand(object obj)
        {
            CurrentChildView = new HomeViewModel();
            Caption = "Dashboard";
            Icon = IconChar.Home;
        }
        private void ExecuteShowPostViewCommand(object obj)
        {
            CurrentChildView = new PostsViewModel();
            Caption = "Posztok";
            Icon = IconChar.Envelope;
        }
        private void ExecuteShowAdsViewCommand(object obj)
        {
            CurrentChildView = new AdsViewModel();
            Caption = "Hirdetések";
            Icon = IconChar.Adversal;
        }
        private void ExecuteShowAdminsViewCommand(object obj)
        {
            CurrentChildView = new AdminsViewModel();
            Caption = "Admins";
            Icon = IconChar.UserTie;
        }
    }
}
