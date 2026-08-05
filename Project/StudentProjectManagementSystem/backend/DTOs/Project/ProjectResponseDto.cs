namespace StudentProjectManagementSystem.DTOs.Project
{
    public class ProjectResponseDto
    {
        public int ProjectId { get; set; }

        public string ProjectTitle { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}