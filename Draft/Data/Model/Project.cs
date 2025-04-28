using System;
using System.Collections.Generic;

namespace Draft.Data.Model
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<TaskItem> Tasks { get; set; }
        public ICollection<Tag> Tags { get; set; }
    }
}