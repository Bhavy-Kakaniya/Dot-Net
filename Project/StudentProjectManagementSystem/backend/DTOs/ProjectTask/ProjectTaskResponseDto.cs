namespace StudentProjectManagementSystem.DTOs.ProjectTask;

public class ProjectTaskResponseDto
{
    public int TaskId { get; set; }

    public int ProjectAllocationId { get; set; }

    public string TaskTitle { get; set; } = string.Empty;

    public string? TaskDescription { get; set; }

    public int TaskStatusId { get; set; }

    public int TaskPriorityId { get; set; }

    public decimal AssignedScore { get; set; }

    public decimal? EarnedScore { get; set; }

    public decimal? ProgressPercentage { get; set; }

    public DateTime TaskAssignedDate { get; set; }

    public DateTime? TaskStartDate { get; set; }

    public DateTime? TaskDueDate { get; set; }

    public DateTime? TaskCompletedDate { get; set; }

    public DateTime? NextFollowUpDate { get; set; }

    public string? FacultyRemarks { get; set; }

    public string? StudentRemarks { get; set; }
}