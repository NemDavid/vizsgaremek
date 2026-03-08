using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class UserModel
    {
        public int id { get; set; }
        public string? email { get; set; }
        public string? username { get; set; }
        public string? role { get; set; }
        public string? created_at { get; set; }
        public ProfileModel? Profile { get; set; }
    }
}
