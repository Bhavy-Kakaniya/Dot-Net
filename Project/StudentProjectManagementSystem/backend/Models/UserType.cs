using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class UserType
{
    [Key]
    public int UserTypeId { get; set; }

    [Required]
    [StringLength(50)]
    public string UserTypeName { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Description { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}