using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.UserType
{
    public class UpdateUserTypeDto
    {
        [Required]
        [StringLength(50)]
        public string UserTypeName { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Description { get; set; }
    }
}