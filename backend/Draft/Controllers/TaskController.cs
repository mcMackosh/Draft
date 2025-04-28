using Draft.ApiResponseGlobal;
using Draft.Attributes;
using Draft.DTO;
using Draft.Enums;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<IActionResult> CreateTask([FromBody] TaskCreateDto taskDto)
    {

        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        if (projectId == 0)
        {
            return BadRequest(new ApiResponse<string>(400, "Project not chosen"));
        }

        try
        {
            var createdTask = await _taskService.CreateTaskAsync(projectId, taskDto);
            return Ok(new ApiResponse<TaskDto>(200, "Task created", createdTask));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(400, ex.Message));
        }
    }

    [HttpPut]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<IActionResult> UpdateTask([FromQuery] int taskId, [FromBody] AllTaskUpdateDto taskDto)
    {


        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        if (projectId == 0 || !await _taskService.IsTaskHaveCorrectProjectId(projectId, taskId))
        {
            return BadRequest(new ApiResponse<string>(400, "Project not chosen or it is incorrect for this task"));
        }

        try
        {
            await _taskService.UpdateTaskAsync(taskId, taskDto);
            return Ok(new ApiResponse<string>(200, "Task updated successfully"));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(400, ex.Message));
        }
    }

    [HttpPut("fragment")]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Executor)]
    public async Task<IActionResult> UpdatePartTask([FromQuery] int taskId, [FromBody] PartTaskUpdateDto taskDto)
    {

        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        if (projectId == 0 || !await _taskService.IsTaskHaveCorrectProjectId(projectId, taskId))
        {
            return BadRequest(new ApiResponse<string>(400, "Project not chosen or it is incorrect for this task"));
        }

        try
        {
            await _taskService.UpdatePartTaskAsync(taskId, taskDto);
            return Ok(new ApiResponse<string>(200, "Task fragment updated successfully"));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(400, ex.Message));
        }
    }

    [HttpDelete]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<IActionResult> DeleteTask([FromQuery] int taskId)
    {
        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        if (projectId == 0 || !await _taskService.IsTaskHaveCorrectProjectId(projectId, taskId))
        {
            return BadRequest(new ApiResponse<string>(400, "Project not chosen or it is incorrect for this task"));
        }

        try
        {
            await _taskService.DeleteTaskAsync(taskId);
            return Ok(new ApiResponse<string>(200, "Task deleted successfully"));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(400, ex.Message));
        }
    }

    [HttpGet]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Executor, RoleEnum.Viewer)]
    public async Task<IActionResult> GetTaskById([FromQuery] int taskId)
    {
        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        if (projectId == 0 || !await _taskService.IsTaskHaveCorrectProjectId(projectId, taskId))
        {
            return BadRequest(new ApiResponse<string>(400, "Project not chosen or it is incorrect for this task"));
        }

        try
        {
            var task = await _taskService.GetTaskByIdAsync(taskId);
            return task != null
                ? Ok(new ApiResponse<TaskDto>(200, "Task retrieved successfully", task))
                : NotFound(new ApiResponse<string>(404, "Task not found"));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(400, ex.Message));
        }
    }

    [HttpPost("all")]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Executor, RoleEnum.Viewer)]
    public async Task<IActionResult> GetTasks([FromBody] TaskFilterRequest filter)
    {
        var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
        try
        {
            var tasks = await _taskService.GetTasksAndUserOfProjectAsync(projectId, filter);
            return Ok(new ApiResponse<IEnumerable<UserTasksListDto>>(200, "Tasks retrieved successfully", tasks));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(400, ex.Message));
        }
    }
}