using Draft.Data.Model;
using Draft.DTO;
using Draft.Enums;
using Draft.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace Draft.Services
{
    public class TaskService : ITaskService
    {
        private readonly DBProjectManagerContext _context;

        public TaskService(DBProjectManagerContext context)
        {
            _context = context;
        }
        public async Task<TaskDto> CreateTaskAsync(int projectId, TaskCreateDto taskDto)
        {
            if (taskDto.TagId.HasValue)
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == taskDto.TagId && t.ProjectId == projectId);
                if (tag == null) throw new Exception("Invalid Tag for this Project");
            }

            var now = DateTime.UtcNow;

            var task = new TaskItem
            {
                Name = taskDto.Name,
                Description = taskDto.Description,
                Priority = taskDto.Priority,
                ProjectId = projectId,
                TagId = taskDto.TagId,
                Status = taskDto.Status,
                ExecutorId = taskDto.ExecutorId,
                StartExecutionAt = taskDto.StartExecutionAt ?? now,
                EndExecutionAt = taskDto.EndExecutionAt ?? now,
                CreatedAt = now,
                UpdatedAt = now
            };
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                Priority = task.Priority,
                TagId = task.TagId,
                Status = task.Status,
                ExecutorId = task.ExecutorId,
                StartExecutionAt = task.StartExecutionAt,
                EndExecutionAt = task.EndExecutionAt,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }

        public async Task<TaskDto> UpdateTaskAsync(int taskId, AllTaskUpdateDto taskDto)
        {
            if (taskDto == null)
            {
                throw new ArgumentNullException(nameof(taskDto), "Task update data cannot be null.");
            }

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
            {
                throw new Exception("Task not found.");
            }

            if (taskDto.TagId.HasValue)
            {
                var tag = await _context.Tags
                    .FirstOrDefaultAsync(t => t.Id == taskDto.TagId && t.ProjectId == task.ProjectId);

                if (tag == null)
                {
                    throw new Exception("Invalid Tag for this Project.");
                }
            }

            if (taskDto.ExecutorId.HasValue)
            {
                var executor = await _context.UserRoles
                    .FirstOrDefaultAsync(ur => ur.UserId == taskDto.ExecutorId && ur.ProjectId == task.ProjectId);

                if (executor == null)
                {
                    throw new Exception("Invalid Executor for this Project.");
                }
            }

            task.Name = taskDto.Name ?? task.Name;
            task.Description = taskDto.Description ?? task.Description;
            task.Priority = taskDto.Priority ?? task.Priority;
            task.TagId = taskDto.TagId ?? task.TagId;
            task.Status = taskDto.Status ?? task.Status;
            task.ExecutorId = taskDto.ExecutorId;
            task.StartExecutionAt = taskDto.StartExecutionAt ?? task.StartExecutionAt;
            task.EndExecutionAt = taskDto.EndExecutionAt ?? task.EndExecutionAt;

            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                Priority = task.Priority,
                TagId = task.TagId,
                Status = task.Status,
                ExecutorId = task.ExecutorId,
                StartExecutionAt = task.StartExecutionAt,
                EndExecutionAt = task.EndExecutionAt,
                CreatedAt = task.CreatedAt,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public async Task DeleteTaskAsync(int taskId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);
            if (task == null) return;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        public async Task<TaskDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);
            if (task == null) return null;

            return new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                Priority = task.Priority,
                TagId = task.TagId,
                Status = task.Status,
                ExecutorId = task.ExecutorId,
                ProjectId = task.ProjectId,
                StartExecutionAt = task.StartExecutionAt,
                EndExecutionAt = task.EndExecutionAt,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }

        public async Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId)
        {
            return await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(task => new TaskDto
                {
                    Id = task.Id,
                    Name = task.Name,
                    Description = task.Description,
                    Priority = task.Priority,
                    TagId = task.TagId,
                    Status = task.Status,
                    ExecutorId = task.ExecutorId,
                    StartExecutionAt = task.StartExecutionAt,
                    EndExecutionAt = task.EndExecutionAt,
                    CreatedAt = task.CreatedAt,
                    UpdatedAt = task.UpdatedAt
                }).ToListAsync();
        }

        public async Task<IEnumerable<UserTasksListDto>> GetTasksAndUserOfProjectAsync(int projectId, TaskFilterRequest? filterRequest)
        {
            filterRequest ??= new TaskFilterRequest();

            DateTime? startDateUtc = filterRequest.DeadlineDateStart?.ToUniversalTime();
            DateTime? endDateUtc = filterRequest.DeadlineDateEnd?.Date.AddDays(1).AddTicks(-1).ToUniversalTime();

            var users = await _context.UserRoles
                .Where(ur => ur.ProjectId == projectId)
                .Select(ur => ur.User)
                .Distinct()
                .Where(u => !filterRequest.ExecutorIds.Any() || filterRequest.ExecutorIds.Contains(u.Id))
                .ToListAsync();

            var tasksQuery = _context.Tasks
                .Where(t => t.ProjectId == projectId);

            if (!string.IsNullOrEmpty(filterRequest.SearchQuery))
            {
                tasksQuery = tasksQuery.Where(t => t.Name.Contains(filterRequest.SearchQuery));
            }

            if (filterRequest.Priorities.Any())
            {
                tasksQuery = tasksQuery.Where(t => filterRequest.Priorities.Contains(t.Priority));
            }

            if (filterRequest.TagIds.Any())
            {
                tasksQuery = tasksQuery.Where(t => t.TagId.HasValue && filterRequest.TagIds.Contains(t.TagId.Value));
            }

            if (filterRequest.Statuses.Any())
            {
                tasksQuery = tasksQuery.Where(t => filterRequest.Statuses.Contains(t.Status));
            }

            tasksQuery = tasksQuery.Where(t => t.EndExecutionAt.HasValue &&
                (!startDateUtc.HasValue || t.EndExecutionAt.Value >= startDateUtc.Value) &&
                (!endDateUtc.HasValue || t.EndExecutionAt.Value <= endDateUtc.Value));

            bool descending = filterRequest.SortByDeadline?.EndsWith("desc") ?? true;
            tasksQuery = descending
                ? tasksQuery.OrderByDescending(t => t.EndExecutionAt)
                : tasksQuery.OrderBy(t => t.EndExecutionAt);

            var tasks = await tasksQuery
                .Select(t => new TaskDtoForList
                {
                    Id = t.Id,
                    Name = t.Name,
                    Priority = t.Priority,
                    TagId = t.TagId,
                    Status = t.Status,
                    ExecutorId = t.ExecutorId,
                    EndExecutionAt = t.EndExecutionAt
                })
                .ToListAsync();

            var groupedTasks = users.Select(user => new UserTasksListDto
            {
                Id = user.Id,
                TasksByDate = tasks
                    .Where(t => t.ExecutorId == user.Id)
                    .GroupBy(t => t.EndExecutionAt?.Date ?? DateTime.MinValue)
                    .OrderBy(g => g.Key)
                    .Select(g => new TaskGroupDto
                    {
                        Date = g.Key.ToString("yyyy-MM-dd"),
                        Tasks = g.ToList()
                    })
                    .ToList()
            }).ToList();

            var unassignedTasks = tasks
                .Where(t => t.ExecutorId == null || !users.Any(u => u.Id == t.ExecutorId))
                .GroupBy(t => t.EndExecutionAt?.Date ?? DateTime.MinValue)
                .OrderBy(g => g.Key)
                .Select(g => new TaskGroupDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Tasks = g.ToList()
                })
                .ToList();

            if (unassignedTasks.Any())
            {
                groupedTasks.Add(new UserTasksListDto
                {
                    Id = null,
                    TasksByDate = unassignedTasks
                });
            }

            return groupedTasks;
        }



        public async Task<bool> IsTaskHaveCorrectProjectId(int projectId, int taskId)
        {
            return await _context.Tasks.AnyAsync(t => t.Id == taskId && t.ProjectId == projectId);
        }

        public async Task<TaskDto> UpdatePartTaskAsync(int taskId, PartTaskUpdateDto taskDto)
        {
            if (taskDto == null)
            {
                throw new ArgumentNullException(nameof(taskDto), "Task update data cannot be null.");
            }

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
            {
                throw new Exception("Task not found.");
            }

            if (taskDto.TagId.HasValue)
            {
                var tag = await _context.Tags
                    .FirstOrDefaultAsync(t => t.Id == taskDto.TagId && t.ProjectId == task.ProjectId);

                if (tag == null)
                {
                    throw new Exception("Invalid Tag for this Project.");
                }
            }

            if (taskDto.ExecutorId.HasValue)
            {
                var executor = await _context.UserRoles
                    .FirstOrDefaultAsync(ur => ur.UserId == taskDto.ExecutorId && ur.ProjectId == task.ProjectId);

                if (executor == null)
                {
                    throw new Exception("Invalid Executor for this Project.");
                }
            }

            task.Priority = taskDto.Priority ?? task.Priority;
            task.TagId = taskDto.TagId ?? task.TagId;
            task.Status = taskDto.Status ?? task.Status;
            task.ExecutorId = taskDto.ExecutorId;

            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                Priority = task.Priority,
                TagId = task.TagId,
                Status = task.Status,
                ExecutorId = task.ExecutorId,
                StartExecutionAt = task.StartExecutionAt,
                EndExecutionAt = task.EndExecutionAt,
                CreatedAt = task.CreatedAt,
                UpdatedAt = DateTime.UtcNow
            };
        }

    }
}