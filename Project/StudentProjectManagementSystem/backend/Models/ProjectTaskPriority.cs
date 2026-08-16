using System.ComponentModel.DataAnnotations;
namespace StudentProjectManagementSystem.Models
{
    public class ProjectTaskPriority
    {
        [Key]
        public int TaskPriorityId { get; set; }

        [Required]
        [StringLength(20)]
        public string TaskPriorityName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string TaskPriorityCssClass { get; set; } = string.Empty;

        public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
    }
}