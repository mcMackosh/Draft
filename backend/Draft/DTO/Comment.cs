using Draft.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace Draft.DTO
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public int TaskItemId { get; set; }
        public int ProjectId { get; set; }
    }

    public class CreateCommentDTO
    {
        //[Required]
        //[MaxLength(1000)]
        public string Content { get; set; }

        //[Required]
        //[Range(1, int.MaxValue)]
        public int TaskItemId { get; set; }
    }
}
