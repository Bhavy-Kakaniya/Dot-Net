using System.ComponentModel.DataAnnotations;
namespace StudentProjectManagementSystem.Models;

public class ProjectTaskStatus
{
    [Key]
    public int TaskStatusId { get; set; }

    [Required]
    [StringLength(20)]
    public string TaskStatusName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string TaskStatusCssClass { get; set; } = string.Empty;

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}