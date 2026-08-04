using System.ComponentModel.DataAnnotations;
using StudentProjectManagementSystem.Models;

public class TaskStatus
{
    [key]
    public int TaskStatusId { get; set; }

    [Required]
    [StringLength(50)]
    public string StatusName { get; set; } = string.Empty;

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}