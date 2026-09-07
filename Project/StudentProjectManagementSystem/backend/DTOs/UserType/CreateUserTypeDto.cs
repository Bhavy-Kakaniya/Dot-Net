namespace StudentProjectManagementSystem.DTOs.UserType
{
    public class CreateUserTypeDto
    {
        public string UserTypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}