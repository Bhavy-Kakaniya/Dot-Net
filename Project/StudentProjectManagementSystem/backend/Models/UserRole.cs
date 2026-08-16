using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class UserRole
{
    [Key]
    public int RolePermissionId { get; set; }

    [Required]
    public int UserId { get; set; }

    public User? User { get; set; }

    [Required]
    public int RoleId { get; set; }

    public Role? Role { get; set; }
}