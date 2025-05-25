using Draft.ApiResponseGlobal;
using Draft.Attributes;
using Draft.DTO;
using Draft.Enums;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Draft.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/roles")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAndUsersRoles()
        {
            var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
            if (projectId == 0)
            {
                return BadRequest(new ApiResponse<string>(400, "Project not chosen"));
            }

            var roles = await _roleService.GetRolesAsync(projectId);
            return Ok(new ApiResponse<List<RoleResponce>>(200, "Roles retrieved successfully", roles));
        }

        [HttpPost("assign")]
        [ProjectAuthorization(RoleEnum.Admin)]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
        {
            var projectId = int.Parse(User.FindFirst("ProjectId")?.Value ?? "0");
            if (projectId == 0)
            {
                return BadRequest(new ApiResponse<string>(400, "Project not chosen"));
            }
            try
            {
                var roleResponse = await _roleService.AssignRoleAsync(projectId, request);
                return Ok(new ApiResponse<RoleResponce>(200, "Role assigned successfully", roleResponse));
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

        [HttpDelete("remove")]
        [ProjectAuthorization(RoleEnum.Admin)]
        public async Task<IActionResult> RemoveRole([FromBody] RemoveRoleRequest request)
        {
            try
            {
                await _roleService.RemoveRoleAsync(request);
                return Ok(new ApiResponse<string>(200, "Role removed successfully"));
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
    }
}
