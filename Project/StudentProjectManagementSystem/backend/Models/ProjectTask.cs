using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class ProjectTask
{
    [Key]
    public int ProjectTaskId { get; set; }

    [Required]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [DataType(DataType.Date)]
    public DateTime DueDate { get; set; }

    [Required]
    public int StatusId { get; set; }

    [Required]
    public int PriorityId { get; set; }

    public Project? Project { get; set; }

    public Status? Status { get; set; }

    public Priority? Priority { get; set; }
}