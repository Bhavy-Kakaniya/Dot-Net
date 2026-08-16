using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.UserRole
{
    public class CreateUserRoleDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}