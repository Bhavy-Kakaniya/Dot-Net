namespace StudentProjectManagementSystem.DTOs.User
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public string ProfilePicturePath { get; set; } = string.Empty;
    }
}
