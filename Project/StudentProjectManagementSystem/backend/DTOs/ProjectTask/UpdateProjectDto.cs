using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.ProjectTask;

public class UpdateProjectTaskDto
{
    [Required]
    public int ProjectAllocationId { get; set; }

    [Required]
    [StringLength(200)]
    public string TaskTitle { get; set; } = string.Empty;

    public string? TaskDescription { get; set; }

    [Required]
    public int TaskStatusId { get; set; }

    [Required]
    public int TaskPriorityId { get; set; }

    [Required]
    public decimal AssignedScore { get; set; }

    public decimal? EarnedScore { get; set; }

    public decimal? ProgressPercentage { get; set; }

    public DateTime? TaskStartDate { get; set; }

    public DateTime? TaskDueDate { get; set; }

    public DateTime? TaskCompletedDate { get; set; }

    public DateTime? NextFollowUpDate { get; set; }

    [StringLength(500)]
    public string? FacultyRemarks { get; set; }

    [StringLength(500)]
    public string? StudentRemarks { get; set; }
}