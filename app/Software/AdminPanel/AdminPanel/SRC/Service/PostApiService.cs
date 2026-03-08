using AdminPanel.SRC.Model;
using AdminPanel.SRC.ViewModel;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Service
{
    public class PostApiService
    {
        private readonly HttpClient _httpClient;

        public PostApiService()
        {
            _httpClient = ApiClient.Client;
        }

        public async Task<List<PostModel>?> GetAllPostsAsync()
        {
            var response = await _httpClient.GetAsync("api/posts/all");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni a posztokat.");
            }

            return await response.Content.ReadFromJsonAsync<List<PostModel>>();
        }

        public async Task DeletePostAsync(int postId)
        {
            var response = await _httpClient.DeleteAsync($"api/posts/{postId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült törölni a posztot.");
            }
        }

        public async Task<List<PostCommentModel>?> GetCommentsForPostAsync(int postId)
        {
            var response = await _httpClient.GetAsync($"api/comments/postComments/{postId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült lekérni a kommenteket.");
            }

            return await response.Content.ReadFromJsonAsync<List<PostCommentModel>>();
        }

        public async Task DeleteCommentAsync(int commentId)
        {
            var response = await _httpClient.DeleteAsync($"api/comments/{commentId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorObj = await response.Content.ReadFromJsonAsync<ErrorResponseModel>();
                throw new Exception(errorObj?.Message ?? "Nem sikerült törölni a kommentet.");
            }
        }
    }
}