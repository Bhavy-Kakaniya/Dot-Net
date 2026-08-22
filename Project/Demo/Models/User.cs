namespace Demo.Models;

public class User
{
    public int UserId { get; set; }
    public string name { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;
    public Student? Student { get; set; }
    public Faculty? Faculty { get; set; }
}