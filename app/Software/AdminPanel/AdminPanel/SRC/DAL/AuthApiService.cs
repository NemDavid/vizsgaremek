using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace AdminPanel.SRC.DAL
{
    public class AuthApiService
    {
        private readonly HttpClient _httpClient;

        public AuthApiService()
        {
            var handler = new HttpClientHandler
            {
                UseCookies = true,
                CookieContainer = new CookieContainer()
            };

            _httpClient = new HttpClient(handler);
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:6769/");
        }

        public async Task<LoginResponseModel?> LoginAsAdminAsync(string username, string password)
        {
            var requestBody = new
            {
                username = username,
                password = password
            };

            var response = await _httpClient.PostAsJsonAsync("api/auth/login/admin", requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(
                    errorObj?.Message ?? "Ismeretlen hiba történt."
                );
            }

            return await response.Content.ReadFromJsonAsync<LoginResponseModel>();
        }
    }
}
