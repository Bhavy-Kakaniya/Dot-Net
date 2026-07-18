namespace StudentProjectManagementSystem.DTOs.Status
{
    public class StatusResponseDto
    {
        public int StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}