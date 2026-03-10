using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Service
{
    public static class ApiClient
    {
        private static readonly CookieContainer _cookieContainer = new();

        private static readonly HttpClientHandler _handler = new()
        {
            UseCookies = true,
            CookieContainer = _cookieContainer
        };

        public static HttpClient Client { get; } = new HttpClient(_handler)
        {
            BaseAddress = new Uri("http://217.76.61.147")
        };
    }
}
