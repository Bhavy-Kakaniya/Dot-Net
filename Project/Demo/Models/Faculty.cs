namespace Demo.Models;

public class Faculty
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Department { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Student> Students { get; set; } = new List<Student>();
}