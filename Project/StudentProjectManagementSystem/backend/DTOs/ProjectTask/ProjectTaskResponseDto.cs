namespace StudentProjectManagementSystem.DTOs.ProjectTask
{
    public class ProjectTaskResponseDto
    {
        public int ProjectTaskId { get; set; }

        public int ProjectId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime DueDate { get; set; }

        public int StatusId { get; set; }

        public int PriorityId { get; set; }
    }
}