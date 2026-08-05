using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.Project
{
    public class UpdateProjectDto
    {
        [Required]
        [StringLength(150)]
        public string ProjectTitle { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
    }
}