using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.Status
{
    public class UpdateStatusDto
    {
        [Required]
        [StringLength(50)]
        public string StatusName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Description { get; set; }
    }
}