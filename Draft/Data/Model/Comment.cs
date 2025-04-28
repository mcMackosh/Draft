namespace Draft.Data.Model
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; }
        public int TaskItemId { get; set; }
        public TaskItem TaskItem { get; set; }
        public int ProjectId { get; set; } // Додано ProjectId
        public Project Project { get; set; } // Додано навігаційну властивість
    }
}