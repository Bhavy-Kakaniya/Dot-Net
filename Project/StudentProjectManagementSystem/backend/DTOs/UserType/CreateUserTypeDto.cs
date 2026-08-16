using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.UserType
{
    public class CreateUserTypeDto
    {
        [Required]
        [StringLength(50)]
        public string UserTypeName { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Description { get; set; }
    }
}