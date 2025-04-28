using Draft.Data.Model;
using Draft.DTO;

namespace Draft.Services.IService
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTaskAsync(int projectId, TaskCreateDto taskDto);
        Task<TaskDto> UpdateTaskAsync(int taskId, AllTaskUpdateDto taskDto);
        Task<TaskDto>  UpdatePartTaskAsync(int taskId, PartTaskUpdateDto taskDto);
        Task DeleteTaskAsync(int taskId);
        Task<TaskDto> GetTaskByIdAsync(int taskId);
        Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId);
        Task<IEnumerable<UserTasksListDto>> GetTasksAndUserOfProjectAsync(int projectId, TaskFilterRequest filterRequest);
        public Task<bool> IsTaskHaveCorrectProjectId(int projectId, int taskId);
    }
}
 