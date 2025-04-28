using Draft.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace Draft.DTO
{
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "Project name is required.")]
        [StringLength(25, ErrorMessage = "Project name must be between 3 and 25 characters.", MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Project description is required.")]
        [StringLength(150, ErrorMessage = "Project description cannot exceed 150 characters.")]
        public string Description { get; set; }
    }

    public class UpdateProjectDto
    {
        [Required(ErrorMessage = "Project name is required.")]
        [StringLength(25, ErrorMessage = "Project name must be between 3 and 25 characters.", MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Project description is required.")]
        [StringLength(150, ErrorMessage = "Project description cannot exceed 150 characters.")]
        public string Description { get; set; }
    }
    public class ProjectDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
