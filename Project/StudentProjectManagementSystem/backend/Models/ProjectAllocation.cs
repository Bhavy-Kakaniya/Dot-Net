using System.ComponentModel.DataAnnotations;
using StudentProjectManagementSystem.Models;

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
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public int TotalTasks { get; set; }

    public int CompletedTasks { get; set; }

    public decimal Progress { get; set; }

    [StringLength(10)]
    public string? OverallGrade { get; set; }

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}