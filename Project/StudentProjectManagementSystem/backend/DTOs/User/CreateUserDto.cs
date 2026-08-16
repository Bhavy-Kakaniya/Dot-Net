using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.user
{
    public class CreateUserDto
    {
        [Required]
        public int UserTypeId { get; set; }

        [Required]
        [StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? UserCode { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string ProfilePicturePath { get; set; } = string.Empty;
    }
}