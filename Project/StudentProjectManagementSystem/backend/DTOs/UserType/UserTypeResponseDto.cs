namespace StudentProjectManagementSystem.DTOs.UserType
{
    public class UserTypeResponseDto
    {
        public int UserTypeId { get; set; }

        public string UserTypeName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}