using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class Status
{
    [Key]
    public int StatusId { get; set; }

    [Required]
    [StringLength(50)]
    public string StatusName { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}