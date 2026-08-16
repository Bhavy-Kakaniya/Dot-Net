using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.Role
{
    public class UpdateRoleDto
    {
        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Description { get; set; }
    }
}