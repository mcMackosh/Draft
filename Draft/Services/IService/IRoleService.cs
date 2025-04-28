using Draft.Data.Model;
using Draft.DTO;

namespace Draft.Services.IService
{
    public interface IRoleService
    {
        Task<List<RoleResponce>> GetRolesAsync(int projectId);
        Task<RoleResponce> AssignRoleAsync(int projectId, AssignRoleRequest request);
        Task<RoleResponce> RemoveRoleAsync(RemoveRoleRequest request);
        Task<bool> IsRoleHaveCorrectProjectId(int projectId, int userId);
    }
}
