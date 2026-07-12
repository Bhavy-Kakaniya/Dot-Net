using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class UserRole
{
    [Key]
    public int UserRoleId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int RoleId { get; set; }

    public User? User { get; set; }

    public Role? Role { get; set; }
}