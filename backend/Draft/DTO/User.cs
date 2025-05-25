using Draft.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace Draft.DTO
{
    public class LoginRequest
    {
        //[Required(ErrorMessage = "Email is required.")]
        //[EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        //[Required(ErrorMessage = "Password is required.")]
        //[MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }
    }

    public class RegistrationRequest
    {
        [Required(ErrorMessage = "Login is required.")]
        [MinLength(3, ErrorMessage = "Login must be at least 3 characters long.")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }
    }

    public class VerifyUserDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Verification code is required.")]
        public string Code { get; set; }
    }

    public class UserDTO
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int? CurrentProjectId { get; set; }
        public string Role { get; set; }

    }

    public class UserResponce
    {
        public string access_token { get; set; }

        public string refresh_token { get; set; }
        public UserDTO user { get; set; }

    }
}
