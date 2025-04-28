using Microsoft.AspNetCore.Http;

namespace Draft.Enums
{
    public static class StatusEnum
    {
        public const string New = "New";
        public const string InProgress = "In Progress";
        public const string PendingReview = "Pending Review";
        public const string Blocked = "Blocked";
        public const string OnHold = "On Hold";
        public const string Testing = "Testing";
        public const string ReadyForDeployment = "Ready for Deployment";
        public const string Completed = "Completed";
    }
}
