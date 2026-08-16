using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.ProjectAllocation
{
    public class UpdateProjectAllocationDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int FacultyId { get; set; }

        [Required]
        public DateTime AssignedDate { get; set; }

        [Required]
        public DateTime ProjectStartDate { get; set; }

        [Required]
        public DateTime ProjectEndDate { get; set; }

        [Required]
        public int TotalTasksGiven { get; set; }

        [Required]
        public int TotalCompletedTasks { get; set; }

        [Required]
        public decimal ProgressPercentage { get; set; }

        [StringLength(1)]
        public string? OverallGrade { get; set; }
    }
}