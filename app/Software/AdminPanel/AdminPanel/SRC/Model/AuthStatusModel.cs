using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class AuthStatusModel
    {
        public int userID { get; set; }
        public string? username { get; set; }
        public string? email { get; set; }
        public string? role { get; set; }
        public long iat { get; set; }
        public long exp { get; set; }
    }
}
