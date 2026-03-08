using AdminPanel.SRC.Model;
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
                var raw = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nem sikerült lekérni a felhasználókat. {raw}");
            }

            return await response.Content.ReadFromJsonAsync<List<UserModel>>();
        }

        public async Task DeleteUserAsync(int userId)
        {
            var response = await _httpClient.DeleteAsync($"api/users/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                var raw = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nem sikerült törölni a felhasználót. {raw}");
            }
        }

        public async Task UpdateUserAsync(int userId, string email, string password, string username)
        {
            var body = new
            {
                email,
                password,
                username
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"api/users/{userId}", content);

            if (!response.IsSuccessStatusCode)
            {
                var raw = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nem sikerült frissíteni a user adatokat. {raw}");
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
                birth_date = birthDate,
                birth_place = birthPlace,
                schools = schools,
                bio = bio
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"api/profiles/{userId}", content);

            if (!response.IsSuccessStatusCode)
            {
                var raw = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nem sikerült frissíteni a profil adatokat. {raw}");
            }
        }
    }
}
