using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.ProjectTask
{
    public class UpdateProjectTaskDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int PriorityId { get; set; }
    }
}