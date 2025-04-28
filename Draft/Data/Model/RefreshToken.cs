using System;

namespace Draft.Data.Model
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Token { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}