using Microsoft.AspNetCore.Http;

namespace Draft.Enums
{
    public static class RoleEnum
    {
        public const string Admin = "ADMIN";
        public const string Manager = "MANAGER";
        public const string Executor = "EXECUTOR";
        public const string Viewer = "VIEWER";
    }
}
