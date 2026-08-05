using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models
{
    public class ProjectTaskPriority
    {
        [Key]
        public int ProjectTaskPriorityId { get; set; }

        [Required]
        [StringLength(50)]
        public string PriorityName { get; set; } = string.Empty;

        public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
    }
}