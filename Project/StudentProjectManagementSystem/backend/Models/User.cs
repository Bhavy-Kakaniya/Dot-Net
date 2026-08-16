using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    public int UserTypeId { get; set; }

    public UserType? UserType { get; set; }

    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [StringLength(100)]
    public string? UserCode { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string MobileNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string ProfilePicturePath { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; } = false;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public ICollection<Project> Projects { get; set; } = new List<Project>();

    public ICollection<ProjectAllocation> StudentProjectAllocations { get; set; } = new List<ProjectAllocation>();

    public ICollection<ProjectAllocation> FacultyProjectAllocations { get; set; } = new List<ProjectAllocation>();

    public ICollection<ProjectTask> AssignedTasks { get; set; } = new List<ProjectTask>();

    public ICollection<ProjectTask> CreatedTasks { get; set; } = new List<ProjectTask>();
}