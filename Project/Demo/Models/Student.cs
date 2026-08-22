namespace Demo.Models;

public class Student
{
    public int id { get; set; }
    public int UserId { get; set; }
    public int facultyid { get; set; }
    public string course { get; set; } = string.Empty;
    public int age { get; set; }
    public User User { get; set; } = null!;
    public Faculty Faculty { get; set; } = null!;
}
