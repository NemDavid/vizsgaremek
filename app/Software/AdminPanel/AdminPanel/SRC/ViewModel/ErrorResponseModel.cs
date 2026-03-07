using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.ViewModel
{
    public class ErrorResponseModel
    {
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public bool IsOperational { get; set; }
    }
}
