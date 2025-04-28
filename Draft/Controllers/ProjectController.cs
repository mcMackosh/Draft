//using Draft.Attributes;
using Draft.ApiResponseGlobal;
using Draft.Attributes;
using Draft.Data.Model;
using Draft.DTO;
using Draft.Enums;
using Draft.Exrption;
using Draft.Services;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Draft.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        [ProjectAuthorization(RoleEnum.Admin)]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto project)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized(new ApiResponse<string>(401, "User not authenticated"));
            }

            try
            {
                var projectResponce = await _projectService.CreateProjectAsync(project, userId);

                return Ok(new ApiResponse<ProjectDto>(200, "Project created successfully", projectResponce));
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }
        [HttpPut]
        [ProjectAuthorization(RoleEnum.Admin)]
        public async Task<IActionResult> UpdateProject([FromQuery] int projectId, [FromBody] UpdateProjectDto project)
        {
            try
            {
                var projectResponce =  await _projectService.UpdateProjectAsync(projectId, project);
                return Ok(new ApiResponse<ProjectDto>(200, "Project updated successfully", projectResponce));
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [HttpDelete]
        [ProjectAuthorization(RoleEnum.Admin)]
        public async Task<IActionResult> DeleteProject()
        {
            var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
            if (projectId == 0)
            {
                return BadRequest(new ApiResponse<string>(400, "Project not chosen"));
            }

            try
            {
                await _projectService.DeleteProjectAsync(projectId);
                return Ok(new ApiResponse<string>(200, "Project deleted successfully"));
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
        }
        [HttpGet]
        [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Executor, RoleEnum.Viewer)]
        public async Task<IActionResult> GetProject()
        {
            var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
            if (projectId == 0)
            {
                return BadRequest(new ApiResponse<string>(400, "Project not chosen"));
            }

            try
            {
                var project = await _projectService.GetProjectByIdAsync(projectId);
                return Ok(new ApiResponse<ProjectDto>(200, "Project retrieved successfully", project));
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetUserProjects()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized(new ApiResponse<string>(401, "User not authenticated"));
            }

            var projects = await _projectService.GetUserProjectsAsync(userId);
            return Ok(new ApiResponse<List<ProjectDto>>(200, "User projects retrieved successfully", projects));
        }
    }
}