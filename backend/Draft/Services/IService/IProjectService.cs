using Draft.Data.Model;
using Draft.DTO;

namespace Draft.Services.IService
{
    public interface IProjectService
    {
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto, int userId);
        Task<ProjectDto> UpdateProjectAsync(int projectId, UpdateProjectDto updateProjectDto);
        Task DeleteProjectAsync(int projectId);
        Task<ProjectDto> GetProjectByIdAsync(int projectId);
        Task<List<ProjectDto>> GetUserProjectsAsync(int userId);
    }
}
