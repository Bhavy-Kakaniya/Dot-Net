using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class Project
{
    [Key]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Technology { get; set; } = string.Empty;

    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; }

    [DataType(DataType.Date)]
    public DateTime EndDate { get; set; }

    [Required]
    public int CreatedByUserId { get; set; }

    public User? CreatedByUser { get; set; }

    public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
}