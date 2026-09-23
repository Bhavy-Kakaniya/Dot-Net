using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace StudentProjectManagementSystem.DTOs.User
{
    public class ProfilePictureUploadDto
    {
        [Required(ErrorMessage = "Profile picture file is required.")]
        public IFormFile File { get; set; } = null!;
    }
}
