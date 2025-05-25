using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Draft.Services.IService;
using Draft.ApiResponseGlobal;
using System.Net;

namespace Draft.Attributes
{

    public class ProjectAuthorizationAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly List<string> _allowedRoles;

        public ProjectAuthorizationAttribute(params string[] allowedRoles)
        {
            _allowedRoles = allowedRoles.ToList();
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                var user = context.HttpContext.User;
                var projectService = context.HttpContext.RequestServices.GetRequiredService<IProjectService>();

                var projectIdClaim = user.Claims.FirstOrDefault(c => c.Type == "ProjectId")?.Value;
                var projectRoleClaim = user.Claims.FirstOrDefault(c => c.Type == "ProjectRole")?.Value;
                var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                if (string.IsNullOrEmpty(projectIdClaim) || string.IsNullOrEmpty(projectRoleClaim) || string.IsNullOrEmpty(userIdClaim))
                {
                    context.Result = new UnauthorizedObjectResult(new ApiResponse<object>(401, "Problem with role identification", null));
                    return;
                }

                if (!int.TryParse(projectIdClaim, out int projectId) || !int.TryParse(userIdClaim, out int userId))
                {
                    context.Result = new BadRequestObjectResult(new ApiResponse<object>(400, "Invalid project or user ID", null));
                    return;
                }

                var userProjects = projectService.GetUserProjectsAsync(userId).GetAwaiter().GetResult();
                var project = userProjects.FirstOrDefault(p => p.Id == projectId);

                // Перевірка доступу до проекту та ролі
                if (project == null)
                {
                    context.Result = new NotFoundObjectResult(new ApiResponse<object>(404, "Project not found", null));
                    return;
                }

                if (!_allowedRoles.Contains(projectRoleClaim))
                {
                    context.Result = new ObjectResult(new ApiResponse<object>(403, "You don't have the required role", null))
                    {
                        StatusCode = (int)HttpStatusCode.Forbidden
                    };
                    return;
                }
            }
            catch (Exception ex)
            {
                context.Result = new ObjectResult(new ApiResponse<object>(500, "Internal Server Error", null))
                {
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
    }

}
