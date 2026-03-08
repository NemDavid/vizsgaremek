using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Runtime.InteropServices;
using System.Windows;
using AdminPanel.SRC.Service;

namespace AdminPanel.SRC.ViewModel
{
    public class LoginViewModel : ViewModelBase
    {
        //Fields
        private string _username;
        private SecureString _password;
        private string _errorMessage;
        private bool _isViewVisible=true;

        private readonly AuthApiService _authApiService;

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
            _username = string.Empty;
            _password = new SecureString();
            _errorMessage = string.Empty;

            _authApiService = new AuthApiService();
            LoginCommand = new ViewModelCommand(async (o) => await ExecuteLoginCommand(), CanExecuteLoginCommand);
        }

        private bool CanExecuteLoginCommand(object obj)
        {
            return !string.IsNullOrWhiteSpace(Username)
                   && Username.Length >= 3
                   && Password != null
                   && Password.Length >= 3;
        }

        private async Task ExecuteLoginCommand()
        {
            try
            {
                ErrorMessage = string.Empty;

                string plainPassword = ConvertToUnsecureString(Password);

                var result = await _authApiService.LoginAsAdminAsync(Username, plainPassword);

                if (result != null && !string.IsNullOrWhiteSpace(result.Token))
                {
                    MessageBox.Show("Sikeres bejelentkezés!");
                    
                    IsViewVisible = false;
                }
                else
                {
                    ErrorMessage = "Sikertelen bejelentkezés.";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
        }
        private string ConvertToUnsecureString(SecureString securePassword)
        {
            if (securePassword == null || securePassword.Length == 0)
                return string.Empty;

            IntPtr unmanagedString = IntPtr.Zero;

            try
            {
                unmanagedString = Marshal.SecureStringToGlobalAllocUnicode(securePassword);
                return Marshal.PtrToStringUni(unmanagedString) ?? string.Empty;
            }
            finally
            {
                Marshal.ZeroFreeGlobalAllocUnicode(unmanagedString);
            }
        }
    }
}
