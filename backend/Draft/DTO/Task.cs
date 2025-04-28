using Draft.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace Draft.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public int? TagId { get; set; }
        public int? ProjectId { get; set; }
        public string? Status { get; set; }
        public int? ExecutorId { get; set; }
        public DateTime? StartExecutionAt { get; set; }
        public DateTime? EndExecutionAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class TaskCreateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MinLength(6, ErrorMessage = "Name must be at least 3 characters long.")]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } = "MEDIUM";
        public int? TagId { get; set; }
        public string? Status { get; set; }
        public int? ExecutorId { get; set; }
        public DateTime? StartExecutionAt { get; set; }
        public DateTime? EndExecutionAt { get; set; }
    }

    public class AllTaskUpdateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long.")]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } = "MEDIUM";
        public int? TagId { get; set; }
        public string Status { get; set; }
        public int? ExecutorId { get; set; }
        public DateTime? StartExecutionAt { get; set; }
        public DateTime? EndExecutionAt { get; set; }
    }

    public class PartTaskUpdateDto
    {
        public string Priority { get; set; } = "MEDIUM";
        public int? TagId { get; set; }
        public string Status { get; set; }
        public int? ExecutorId { get; set; }
    }

}
