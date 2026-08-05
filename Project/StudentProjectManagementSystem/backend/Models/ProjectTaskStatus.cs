namespace StudentProjectManagementSystem.Models
{
    public class ProjectTaskStatus
    {
        public int TaskStatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public ICollection<ProjectTask> ProjectTasks { get; set; }
            = new List<ProjectTask>();
    }
}