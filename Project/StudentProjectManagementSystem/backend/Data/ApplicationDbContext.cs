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
    public DbSet<UserType> UserTypes { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectAllocation> ProjectAllocations { get; set; }
    public DbSet<ProjectTask> ProjectTasks { get; set; }
    public DbSet<ProjectTaskStatus> TaskStatuses { get; set; }
    public DbSet<ProjectTaskPriority> TaskPriorities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureUserRole(modelBuilder);
        ConfigureProjectAllocation(modelBuilder);
        ConfigureProjectTask(modelBuilder);
    }

    private static void ConfigureUserRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureProjectAllocation(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectAllocation>()
            .HasOne(pa => pa.Project)
            .WithMany(p => p.ProjectAllocations)
            .HasForeignKey(pa => pa.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProjectAllocation>()
            .HasOne(pa => pa.Student)
            .WithMany(u => u.StudentProjectAllocations)
            .HasForeignKey(pa => pa.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProjectAllocation>()
            .HasOne(pa => pa.Faculty)
            .WithMany(u => u.FacultyProjectAllocations)
            .HasForeignKey(pa => pa.FacultyId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureProjectTask(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.ProjectAllocation)
            .WithMany(pa => pa.ProjectTasks)
            .HasForeignKey(pt => pt.ProjectAllocationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.ProjectTaskStatus)
            .WithMany(ts => ts.ProjectTasks)
            .HasForeignKey(pt => pt.TaskStatusId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(pt => pt.ProjectTaskPriority)
            .WithMany(tp => tp.ProjectTasks)
            .HasForeignKey(pt => pt.TaskPriorityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}