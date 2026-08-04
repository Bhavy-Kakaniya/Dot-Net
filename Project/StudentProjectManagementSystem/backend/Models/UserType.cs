using System.ComponentModel.DataAnnotations;
using StudentProjectManagementSystem.Models;

public class UserType
{
    [Key]
    public int UserTypeId { get; set; }

    [Required]
    [StringLength(50)]
    public string UserTypeName { get; set; } = string.Empty;
    public ICollection<User> Useres {get; set; } = new List<User>();
}
