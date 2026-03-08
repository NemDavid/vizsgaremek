using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class ProfileModel
    {
        public int id { get; set; }
        public int USER_ID { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? birth_date { get; set; }
        public string? birth_place { get; set; }
        public string? schools { get; set; }
        public string? bio { get; set; }
        public string? avatar_url { get; set; }
        public int? level { get; set; }
        public int? XP { get; set; }
    }
}
