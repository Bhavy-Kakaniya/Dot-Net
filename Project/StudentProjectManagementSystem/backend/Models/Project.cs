using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class Project
{
    [Key]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(150)]
    public string ProjectTitle { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    public ICollection<ProjectAllocation> ProjectAllocations { get; set; } = new List<ProjectAllocation>();
}