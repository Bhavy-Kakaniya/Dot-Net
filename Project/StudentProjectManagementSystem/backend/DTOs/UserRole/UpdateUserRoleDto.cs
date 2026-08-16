using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.UserRole
{
    public class UpdateUserRoleDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}