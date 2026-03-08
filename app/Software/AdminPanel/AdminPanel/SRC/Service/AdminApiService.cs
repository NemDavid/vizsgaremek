using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Service
{
    public class AdminApiService
    {
        private readonly HttpClient _httpClient;

        public AdminApiService()
        {
            _httpClient = ApiClient.Client;
        }

        public async Task<AdminInfoModel?> GetAdminInfoAsync()
        {
            var response = await _httpClient.GetAsync("api/admins/info");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni az admin statisztikát.");
            }

            return await response.Content.ReadFromJsonAsync<AdminInfoModel>();
        }

        public async Task<List<AdminUserModelWithProfile>?> GetAdminsAsync()
        {
            var response = await _httpClient.GetAsync("api/admins/all");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni az adminokat.");
            }

            return await response.Content.ReadFromJsonAsync<List<AdminUserModelWithProfile>>();
        }

        public async Task<AuthStatusModel?> GetCurrentUserStatusAsync()
        {
            var response = await _httpClient.GetAsync("api/auth/status");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni az aktuális user státuszát.");
            }

            return await response.Content.ReadFromJsonAsync<AuthStatusModel>();
        }

        public async Task UpdateAdminRoleAsync(int userId, string role)
        {
            var body = new
            {
                role
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"api/admins/{userId}", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült módosítani a role-t.");
            }
        }

        public async Task DeleteAdminAsync(int userId)
        {
            var response = await _httpClient.DeleteAsync($"api/admins/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült törölni az admint.");
            }
        }
    }
}
