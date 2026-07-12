// updating existing user
// PUT /api/User/5

using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.user
{
    public class UpdateUserDto
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}