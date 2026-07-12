using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class Priority
{
    [Key]
    public int PriorityId { get; set; }

    [Required]
    [StringLength(50)]
    public string PriorityName { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}