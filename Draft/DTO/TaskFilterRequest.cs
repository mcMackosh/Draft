using Draft.Data.Model;

namespace Draft.DTO
{
    public class TaskDtoForList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Priority { get; set; }
        public int? TagId { get; set; }
        public string? Status { get; set; }
        public int? ExecutorId { get; set; }
        public DateTime? EndExecutionAt { get; set; }
    }

    public class TaskGroupDto
    {
        public string Date { get; set; } = string.Empty;
        public List<TaskDtoForList> Tasks { get; set; } = new();
    }

    public class UserTasksListDto
    {
        public int? Id { get; set; }
        public List<TaskGroupDto> TasksByDate { get; set; } = new();
    }

    public class TaskFilterRequest
    {
        public int[] TagIds { get; set; } = Array.Empty<int>();
        public int[] ExecutorIds { get; set; } = Array.Empty<int>();
        public DateTime? DeadlineDateStart { get; set; }
        public DateTime? DeadlineDateEnd { get; set; }
        public string SortByDeadline { get; set; } = "desc";
        public string SearchQuery { get; set; } = string.Empty;
        public string[] Priorities { get; set; } = Array.Empty<string>();
        public string[] Statuses { get; set; } = Array.Empty<string>();
    }
}


