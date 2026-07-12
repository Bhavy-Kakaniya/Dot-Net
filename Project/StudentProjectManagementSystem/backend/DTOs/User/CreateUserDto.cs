// only this data will be send to frontend when creating new user
// POST /api/user
using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.user
{
    public class CreateUserDto
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
    }
}