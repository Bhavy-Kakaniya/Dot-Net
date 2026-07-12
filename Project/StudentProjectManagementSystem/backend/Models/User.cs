using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Phone]
    [StringLength(15)]
    public string? MobileNumber { get; set; }

    [StringLength(255)]
    public string? ProfilePicturePath { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; } = false;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}