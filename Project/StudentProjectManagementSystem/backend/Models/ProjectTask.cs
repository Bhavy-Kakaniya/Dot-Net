using System.ComponentModel.DataAnnotations;
namespace StudentProjectManagementSystem.Models;

public class ProjectTask
{
    [Key]
    public int TaskId { get; set; }

    [Required]
    public int ProjectAllocationId { get; set; }

    public ProjectAllocation? ProjectAllocation { get; set; }

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

    public User? AssignedByFaculty { get; set; }

    [Required]
    public int AssignedToStudentId { get; set; }

    public User? AssignedToStudent { get; set; }

    [Required]
    public int TaskStatusId { get; set; }

    public ProjectTaskStatus? ProjectTaskStatus { get; set; }

    [Required]
    public int ProjectTaskPriorityId { get; set; }

    public ProjectTaskPriority? ProjectTaskPriority { get; set; }
}