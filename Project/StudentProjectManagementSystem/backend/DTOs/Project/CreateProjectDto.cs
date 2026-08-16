using System.ComponentModel.DataAnnotations;
namespace StudentProjectManagementSystem.DTOs.Project;

public class CreateProjectDto
{
    [Required]
    [StringLength(150)]
    public string ProjectTitle { get; set; } = string.Empty;
}