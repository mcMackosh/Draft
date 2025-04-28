using Draft.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace Draft.DTO
{
    public class UpdateTagDto
    {
        [Required(ErrorMessage = "Tag name is required")]
        [StringLength(20, MinimumLength = 1, ErrorMessage = "Tag name must be between 1 and 20 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Color is required")]
        [RegularExpression("^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color must be a valid hex code (e.g., #FF5733)")]
        public string Color { get; set; }
    }

    public class CreateTagDto
    {
        [Required(ErrorMessage = "Tag name is required")]
        [StringLength(20, MinimumLength = 1, ErrorMessage = "Tag name must be between 1 and 20 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Color is required")]
        [RegularExpression("^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color must be a valid hex code (e.g., #FF5733)")]
        public string Color { get; set; }
    }

    public class TagResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
}
