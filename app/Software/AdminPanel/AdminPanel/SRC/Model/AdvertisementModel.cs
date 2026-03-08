using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class AdvertisementModel
    {
        public int ID { get; set; }
        public string? title { get; set; }
        public string? subject { get; set; }
        public string? imagePath { get; set; }
        public string? created_at { get; set; }
    }
}
