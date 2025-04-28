using System;

namespace Draft.Data.Model
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public string Priority { get; set; } // LOW, MEDIUM, UPPER_MEDIUM, HIGH
        public int? TagId { get; set; }
        public Tag Tag { get; set; }
        public string Status { get; set; }
        public int? ExecutorId { get; set; }
        public User Executor { get; set; }
        public DateTime? StartExecutionAt { get; set; }
        public DateTime? EndExecutionAt { get; set; }
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; }
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}
