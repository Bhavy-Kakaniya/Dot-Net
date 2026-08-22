namespace Demo.Models;

public class Student
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FacultyId { get; set; }
    public int Age { get; set; }
    public string Course { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public Faculty Faculty { get; set; } = null!;
}