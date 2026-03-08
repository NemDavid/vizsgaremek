using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Service
{
    public class UserApiService
    {
        private readonly HttpClient _httpClient;

        public UserApiService()
        {
            _httpClient = ApiClient.Client;
        }

        public async Task<List<UserModel>?> GetAllUsersAsync()
        {
            var response = await _httpClient.GetAsync("api/users/all");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni a felhasználókat.");
            }

            return await response.Content.ReadFromJsonAsync<List<UserModel>>();
        }

        public async Task DeleteUserAsync(int userId)
        {
            var response = await _httpClient.DeleteAsync($"api/users/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült törölni a felhasználót.");
            }
        }

        public async Task UpdateUserAsync(int userId, string email, string username)
        {
            var body = new
            {
                email,
                username
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"api/users/{userId}", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült frissíteni a felhasználót.");
            }
        }

        public async Task UpdateProfileAsync(
            int userId,
            string? firstName,
            string? lastName,
            string? birthDate,
            string? birthPlace,
            string? schools,
            string? bio)
        {
            var body = new
            {
                first_name = firstName,
                last_name = lastName,
                birth_date = string.IsNullOrWhiteSpace(birthDate) ? "0000-00-00" : birthDate,
                birth_place = birthPlace,
                schools = schools,
                bio = bio
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"api/profiles/{userId}", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült frissíteni a profilt.");
            }
        }
    }
}