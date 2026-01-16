using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;

namespace Mihirunk
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();
        }

        private async void InitializeAsync()
        {
            // AppData Local mappa + Mihirunk
            string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string userDataFolder = System.IO.Path.Combine(appData, "Mihirunk");

            // Környezet létrehozása tartós profillal
            var env = await CoreWebView2Environment.CreateAsync(userDataFolder: userDataFolder);

            await webView.EnsureCoreWebView2Async(env);

            // Alap URL
            webView.CoreWebView2.Navigate("http://localhost:3000/");
        }

    }
}
