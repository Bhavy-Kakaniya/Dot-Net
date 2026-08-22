namespace Demo.DTOs;

public class StudentDto
{
    public int UserId { get; set; }
    public int FacultyId { get; set; }
    public int Age { get; set; }
    public string Course { get; set; } = string.Empty;
}