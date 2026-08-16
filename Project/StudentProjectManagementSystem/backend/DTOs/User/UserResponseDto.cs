namespace StudentProjectManagementSystem.DTOs.User
{
    public class UserResponseDto
    {
        public int UserId { get; set; }

        public int UserTypeId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string? UserCode { get; set; }

        public string Email { get; set; } = string.Empty;

        public string MobileNumber { get; set; } = string.Empty;

        public string ProfilePicturePath { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }
    }
}