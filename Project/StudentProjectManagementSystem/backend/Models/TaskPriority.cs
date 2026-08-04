using System.ComponentModel.DataAnnotations;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Models;

public class TaskPriority
{
    [key]
    public int TaskPriorityId {get; set;}
    [Required]
    [StringLength(50)]
    public string PriorityName {get; set;} = string.Empty;

    public ICollection<ProjectTask> ProjectTasks {get; set;} = new List<ProjectTask>();
}