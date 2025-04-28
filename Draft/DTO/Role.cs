using Draft.Data.Model;

namespace Draft.DTO
{
    public class AssignRoleRequest
    {
        public int UserId { get; set; }
        public string Role { get; set; } // ADMIN, MANAGER, EXECUTOR, VIEWER
    }

    public class RemoveRoleRequest
    {
        public int UserId { get; set; }
        public int ProjectId { get; set; }
    }

    public class RoleResponce
    {
        public int UserId { get; set; }

        public string UserLogin { get; set; }

        public string UserEmail { get; set; }

        public string Role { get; set; }
    }

}
