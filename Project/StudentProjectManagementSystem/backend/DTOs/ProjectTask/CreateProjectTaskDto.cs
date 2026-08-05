using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.ProjectTask
{
    public class CreateProjectTaskDto
    {
        [Required]
        public int ProjectAllocationId { get; set; }

        [Required]
        [StringLength(200)]
        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        [Required]
        public DateTime AssignedDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? SubmissionDate { get; set; }

        [Required]
        public int AssignedByFacultyId { get; set; }

        [Required]
        public int AssignedToStudentId { get; set; }

        [Required]
        public int TaskStatusId { get; set; }

        [Required]
        public int TaskPriorityId { get; set; }
    }
}