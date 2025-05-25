namespace Draft.Data.Model
{
    public class UserRole
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public string Role { get; set; } // ADMIN, LEADER, EXECUTOR
    }
}