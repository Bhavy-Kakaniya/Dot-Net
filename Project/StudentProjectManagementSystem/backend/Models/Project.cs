using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models;

public class Project
{
    [Key]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(200)]
    public string ProjectTitle { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<ProjectAllocation> ProjectAllocations { get; set; } = new List<ProjectAllocation>();
}