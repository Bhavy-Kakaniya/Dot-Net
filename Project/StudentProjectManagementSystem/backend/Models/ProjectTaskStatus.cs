using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.Models
{
    public class ProjectTaskStatus
    {
        [Key]
        public int TaskStatusId { get; set; }

        [Required]
        [StringLength(50)]
        public string StatusName { get; set; } = string.Empty;

        public ICollection<ProjectTask> ProjectTasks { get; set; }
            = new List<ProjectTask>();
    }
}