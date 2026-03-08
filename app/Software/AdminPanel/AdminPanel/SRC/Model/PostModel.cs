using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminPanel.SRC.Model
{
    public class PostModel
    {
        public int ID { get; set; }
        public int USER_ID { get; set; }
        public int like { get; set; }
        public int dislike { get; set; }
        public bool visibility { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public string? media_url { get; set; }
        public string? created_at { get; set; }
        public string? updated_at { get; set; }

        public List<PostCommentModel>? comments { get; set; }
    }

}
