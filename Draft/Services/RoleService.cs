using Draft.Data.Model;
using Draft.DTO;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespace.Services
{
    public class RoleService : IRoleService
    {
        private readonly DBProjectManagerContext _context;

        public RoleService(DBProjectManagerContext context)
        {
            _context = context;
        }

        public async Task<List<RoleResponce>> GetRolesAsync(int projectId)
        {
            var roles = await _context.UserRoles
                .Where(ur => ur.ProjectId == projectId)
                .Select(ur => new RoleResponce
                {
                    UserId = ur.UserId,
                    UserLogin = ur.User.Login,
                    UserEmail = ur.User.Email,
                    Role = ur.Role
                })
                .ToListAsync();

            return roles;
        }

        public async Task<RoleResponce> AssignRoleAsync(int projectId, AssignRoleRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);

            if (user == null)
                throw new NotFoundException("User not found.");
            if (!projectExists)
                throw new NotFoundException("Project not found.");

            var validRoles = new[] { "ADMIN", "MANAGER", "EXECUTOR", "VIEWER" };
            if (!validRoles.Contains(request.Role))
                throw new ValidationException("Invalid role.");

            var existingRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId && ur.ProjectId == projectId);

            if (existingRole != null)
            {
                existingRole.Role = request.Role;
            }
            else
            {
                var newRole = new UserRole
                {
                    UserId = request.UserId,
                    ProjectId = projectId,
                    Role = request.Role
                };
                _context.UserRoles.Add(newRole);
            }

            await _context.SaveChangesAsync();

            return new RoleResponce
            {
                UserId = request.UserId,
                UserLogin = user.Login,
                UserEmail = user.Email,
                Role = request.Role
            };
        }

        public async Task<RoleResponce> RemoveRoleAsync(RemoveRoleRequest request)
        {
            var roleToRemove = await _context.UserRoles
                .Include(ur => ur.User)
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId && ur.ProjectId == request.ProjectId);

            if (roleToRemove == null)
            {
                throw new NotFoundException("Role not found.");
            }

            _context.UserRoles.Remove(roleToRemove);
            await _context.SaveChangesAsync();

            return new RoleResponce
            {
                UserId = request.UserId,
                UserLogin = roleToRemove.User.Login,
                UserEmail = roleToRemove.User.Email,
                Role = roleToRemove.Role
            };
        }

        public async Task<bool> IsRoleHaveCorrectProjectId(int projectId, int userId)
        {
            return await _context.UserRoles.AnyAsync(t => t.UserId == userId && t.ProjectId == projectId);
        }
    }
}