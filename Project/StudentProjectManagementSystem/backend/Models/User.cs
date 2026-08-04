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
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string? UserCode { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Phone]
    [StringLength(15)]
    public string? MobileNumber { get; set; } = string.Empty;

    [StringLength(255)]
    public string? ProfilePicturePath { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; } = false;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public ICollection<Project> Projects { get; set; } = new List<Project>();

    public ICollection<ProjectAllocation> FacultyProjectAllocations { get; set; } = new List<ProjectAllocation>();
}