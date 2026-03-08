using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class PostCommentModel
    {
        public int ID { get; set; }
        public int USER_ID { get; set; }
        public int POST_ID { get; set; }
        public string? comment { get; set; }
        public string? created_at { get; set; }
    }
}
