namespace Demo.Models;

public class Faculty
{
    public int id { get; set; }
    public int UserId { get; set; }
    public string department { get; set; } = string.Empty;
    public int salary { get; set; }
    public ICollection<Student> Students { get; set; } = new List<Student>();
}