using Microsoft.EntityFrameworkCore;
using Demo.Models;

namespace Demo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Student> Students { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // one to one user to student
        modelBuilder.Entity<User>()
        .HasOne(u => u.Student)
        .WithOne(s => s.User)
        .HasForeignKey<Student>(s => s.UserId);

        // one to one user to faculty
        modelBuilder.Entity<User>()
        .HasOne(u => u.Faculty)
        .WithOne(f => f.User)
        .HasForeignKey<Faculty>(f => f.UserId);

        // one to many faculty to student
        modelBuilder.Entity<Faculty>()
        .HasMany(f => f.Students)
        .WithOne(s => s.Faculty)
        .HasForeignKey(s => s.facultyid);

        modelBuilder.Entity<User>()
        .Property(u => u.name)
        .IsRequired()
        .HasMaxLength(30);

        modelBuilder.Entity<User>()
        .Property(u => u.email)
        .IsRequired()
        .HasMaxLength(50);
    }
}