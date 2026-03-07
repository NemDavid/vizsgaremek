using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace AdminPanel.SRC.ViewModel
{
    public class LoginViewModel : ViewModelBase
    {
        //Fields
        private string _username;
        private SecureString _password;
        private string _errorMessage;
        private bool _isViewVisible=true;

        //Properties
        public string Username 
        {
            get 
            {
                return _username;
            } 
            set
            {
                _username = value;
                OnPropertyChanged(nameof(Username));
            }
        }
        public SecureString Password 
        {
            get
            {
                return _password;
            }
            set
            {
                _password = value;
                OnPropertyChanged(nameof(Password));

            }
        }
        public string ErrorMessage 
        { 
            get
            {
                return _errorMessage;
            }
            set
            {
                _errorMessage = value;
                OnPropertyChanged(nameof(ErrorMessage));

            }
        }
        public bool IsViewVisible 
        { 
            get
            {
                return _isViewVisible;
            }
            set
            {
                _isViewVisible = value;
                OnPropertyChanged(nameof(IsViewVisible));

            }
        }
        //-> Commands
        public ICommand LoginCommand { get; }
        public ICommand ShowPasswordCommand { get; }

        //Consturctor
        public LoginViewModel()
        {
            LoginCommand = new ViewModelCommand(executeLoginCommand, CanExecuteLoginCommand);
        }

        private bool CanExecuteLoginCommand(object obj)
        {
            bool validDate;
            if (string.IsNullOrWhiteSpace(Username) || 
                Username.Length < 3 || 
                Password==null || 
                Password.Length<3)
                validDate = false;
            else 
                validDate = true;

            return validDate;
        }

        private void executeLoginCommand(object obj)
        {
            throw new NotImplementedException();
        }
    }
}
