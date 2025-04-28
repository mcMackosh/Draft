using Draft.Data.Model;
using Microsoft.EntityFrameworkCore;

public class DBProjectManagerContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserInfo> UserInfos { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Comment> Comments { get; set; }

    public DBProjectManagerContext(DbContextOptions<DBProjectManagerContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Login)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<UserInfo>()
            .HasKey(ui => ui.UserId);

        modelBuilder.Entity<UserInfo>()
            .HasOne(ui => ui.User)
            .WithOne(u => u.UserInfo)
            .HasForeignKey<UserInfo>(ui => ui.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.ProjectId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Project)
            .WithMany(p => p.UserRoles)
            .HasForeignKey(ur => ur.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade); // Виправлено на Cascade!

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Tag)
            .WithMany()
            .HasForeignKey(t => t.TagId)
            .OnDelete(DeleteBehavior.SetNull); // Якщо тег видалити — задача залишиться без тегу.

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Executor)
            .WithMany()
            .HasForeignKey(t => t.ExecutorId)
            .OnDelete(DeleteBehavior.SetNull); // Якщо виконавця видалити — задача лишиться без виконавця.

        modelBuilder.Entity<Tag>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tags)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade); // Якщо проект видалити — всі теги цього проекту видаляться.

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.TaskItem)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade); // Якщо задача видаляється — видаляються і коментарі до неї.

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Author)
            .WithMany()
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict); // Не дозволяти видаляти автора, якщо є його коментарі.

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Project)
            .WithMany()
            .HasForeignKey(c => c.ProjectId)
            .OnDelete(DeleteBehavior.Cascade); // Якщо проект видаляється — видаляються і коментарі проекту.
    }
}
