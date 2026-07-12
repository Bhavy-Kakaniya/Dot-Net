using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectTask> ProjectTasks { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Priority> Priorities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureUserRole(modelBuilder);
        ConfigureProject(modelBuilder);
        ConfigureProjectTask(modelBuilder);
    }

    private static void ConfigureUserRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User).WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role).WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasIndex(ur => new { ur.UserId, ur.RoleId }).IsUnique();
    }

    private static void ConfigureProject(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>()
            .HasOne(p => p.CreatedByUser).WithMany(u => u.Projects)
            .HasForeignKey(p => p.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureProjectTask(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.Project).WithMany(p => p.ProjectTasks)
            .HasForeignKey(pt => pt.ProjectId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.Status).WithMany(s => s.ProjectTasks)
            .HasForeignKey(pt => pt.StatusId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.Priority).WithMany(p => p.ProjectTasks)
            .HasForeignKey(pt => pt.PriorityId).OnDelete(DeleteBehavior.Restrict);
    }
}