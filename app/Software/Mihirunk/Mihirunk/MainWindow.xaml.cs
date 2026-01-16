using Microsoft.Web.WebView2.Core;
using System;
using Newtonsoft.Json;
using System.Windows;
using System.Windows.Controls;

namespace Mihirunk
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();
        }

        private async void InitializeAsync()
        {
            string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string userDataFolder = System.IO.Path.Combine(appData, "Mihirunk");

            var env = await CoreWebView2Environment.CreateAsync(userDataFolder: userDataFolder);
            await webView.EnsureCoreWebView2Async(env);

            // JS → WPF üzenetek fogadása
            webView.CoreWebView2.WebMessageReceived += WebMessageReceived;

            // FETCH HOOK injektálása
            await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(GetAuthHookScript());

            webView.CoreWebView2.Navigate("http://localhost:3000/");
        }

        private void WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                // régi WebView2 SDK: egyszerűen visszaadja a stringet
                string json = e.TryGetWebMessageAsString(); // nálad ez működik

                if (string.IsNullOrEmpty(json))
                {
                    HideAdmin();
                    return;
                }

                var msg = JsonConvert.DeserializeObject<AuthMessage>(json);

                if (msg == null)
                {
                    HideAdmin();
                    return;
                }

                // CSAK EZ AZ EGY SZABÁLY
                if (
                    (msg.status == 200 || msg.status == 304 ) &&
                    (msg.role == "admin" || msg.role == "moderator" || msg.role == "owner")
                )
                {
                    ShowAdmin();
                }
                else
                {
                    HideAdmin();
                }
            }
            catch
            {
                // backend hiba / parse hiba / bármi
                HideAdmin();
            }
        }



        private void ShowAdmin()
        {
            AdminButtons.Visibility = Visibility.Visible;
        }

        private void HideAdmin()
        {
            AdminButtons.Visibility = Visibility.Collapsed;
            AdminView.Visibility = Visibility.Collapsed;
            webView.Visibility = Visibility.Visible;
        }

        private void BtnWebsiteView_Click(object sender, RoutedEventArgs e)
        {
            AdminView.Visibility = Visibility.Collapsed;
            webView.Visibility = Visibility.Visible;
        }

        private void BtnAdminView_Click(object sender, RoutedEventArgs e)
        {
            webView.Visibility = Visibility.Collapsed;
            AdminView.Visibility = Visibility.Visible;
        }

        private void AdminMenu_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn)
            {
                AdminContent.Content = new TextBlock
                {
                    Text = $"{btn.Content} oldal",
                    FontSize = 24,
                    Margin = new Thickness(20)
                };
            }
        }

        // DTO
        private class AuthMessage
        {
            public int status { get; set; }
            public string role { get; set; }
        }

        // JS FETCH HOOK
        private string GetAuthHookScript() => @"
(() => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    try {
      const url = args[0]?.toString() || '';
      if (url.includes('/api/auth/status')) {
        const clone = response.clone();
        let role = null;

        if (response.status === 200) {
          const data = await clone.json();
          role = data?.role || null;
        }

        window.chrome.webview.postMessage({
          status: response.status,
          role: role
        });
      }
    } catch (e) {
      window.chrome.webview.postMessage({
        status: -1,
        role: null
      });
    }

    return response;
  };
})();
";
    }
}
