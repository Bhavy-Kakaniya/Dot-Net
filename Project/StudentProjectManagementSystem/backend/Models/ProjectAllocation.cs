using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class ProjectAllocation
{
    [Key]
    public int ProjectAllocationId { get; set; }

    [Required]
    public int ProjectId { get; set; }

    public Project? Project { get; set; }

    [Required]
    public int StudentId { get; set; }

    public User? Student { get; set; }

    [Required]
    public int FacultyId { get; set; }

    public User? Faculty { get; set; }

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

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}