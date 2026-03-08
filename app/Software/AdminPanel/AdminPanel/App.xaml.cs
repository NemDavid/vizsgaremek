using AdminPanel.SRC.ViewModel;
using AdminPanel.SRC.Views;
using System.Configuration;
using System.Data;
using System.Windows;

namespace AdminPanel
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected void ApplicationStart(object sender, StartupEventArgs e)
        {
            var loginView = new Login();
            loginView.Show();

            loginView.IsVisibleChanged += (s, ev) =>
            {
                if (loginView.DataContext is LoginViewModel vm &&
                    vm.IsViewVisible == false &&
                    loginView.IsLoaded)
                {
                    var mainView = new MainWindow();
                    mainView.Show();
                    loginView.Close();
                }
            };
        }
    }
}
