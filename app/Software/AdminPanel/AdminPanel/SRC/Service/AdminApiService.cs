using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
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
    }
}
