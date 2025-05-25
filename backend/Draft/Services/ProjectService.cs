using Draft.Data.Model;
using Draft.DTO;
using Draft.Enums;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace Draft.Services
{
    public class ProjectService : IProjectService
    {
        private readonly DBProjectManagerContext _context;

        public ProjectService(DBProjectManagerContext context)
        {
            _context = context;
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto, int userId)
        {
            if (string.IsNullOrWhiteSpace(createProjectDto.Name))
                throw new ValidationException("Project name is required.");

            var project = new Project
            {
                Name = createProjectDto.Name,
                Description = createProjectDto.Description
            };

            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();

            var adminRole = new UserRole
            {
                UserId = userId,
                ProjectId = project.Id,
                Role = RoleEnum.Admin
            };

            await _context.UserRoles.AddAsync(adminRole);
            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }

        public async Task<ProjectDto> UpdateProjectAsync(int projectId, UpdateProjectDto updateProjectDto)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) throw new NotFoundException("Project not found.");

            if (string.IsNullOrWhiteSpace(updateProjectDto.Name))
                throw new ValidationException("Project name is required.");

            project.Name = updateProjectDto.Name;
            project.Description = updateProjectDto.Description;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }
        public async Task DeleteProjectAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) throw new NotFoundException("Project not found.");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }

        public async Task<ProjectDto> GetProjectByIdAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) throw new NotFoundException("Project not found.");

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }
        public async Task<List<ProjectDto>> GetUserProjectsAsync(int userId)
        {
            var projectIds = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.ProjectId)
                .ToListAsync();

            var projects = await _context.Projects
                .Where(p => projectIds.Contains(p.Id))
                .ToListAsync();


            return projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();
        }
    }
}
