using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Service
{
    public class AdvertisementApiService
    {
        private readonly HttpClient _httpClient;

        public AdvertisementApiService()
        {
            _httpClient = ApiClient.Client;
        }

        public async Task<List<AdvertisementModel>?> GetAllAdvertisementsAsync()
        {
            var response = await _httpClient.GetAsync("api/advertisement/all");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni a hirdetéseket.");
            }

            return await response.Content.ReadFromJsonAsync<List<AdvertisementModel>>();
        }

        public async Task DeleteAdvertisementAsync(int advertisementId)
        {
            var response = await _httpClient.DeleteAsync($"api/advertisement/{advertisementId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült törölni a hirdetést.");
            }
        }

        public async Task CreateAdvertisementAsync(string title, string subject, string? imageFilePath)
        {
            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(title), "title");
            form.Add(new StringContent(subject), "subject");

            if (!string.IsNullOrWhiteSpace(imageFilePath) && File.Exists(imageFilePath))
            {
                var stream = File.OpenRead(imageFilePath);
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

                form.Add(fileContent, "image", Path.GetFileName(imageFilePath));
            }

            var response = await _httpClient.PostAsync("api/advertisement", form);

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült létrehozni a hirdetést.");
            }
        }
    }
}
