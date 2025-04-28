using System;
using System.Collections.Generic;

namespace Draft.Data.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string VerificationCode { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public UserInfo UserInfo { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}