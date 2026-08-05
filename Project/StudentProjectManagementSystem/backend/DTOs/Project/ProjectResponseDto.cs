namespace StudentProjectManagementSystem.DTOs.Project
{
    public class ProjectResponseDto
    {
        public int ProjectId { get; set; }

        public string ProjectTitle { get; set; } = string.Empty;

        public string StatusName { get; set; } = string.Empty;
    }
}