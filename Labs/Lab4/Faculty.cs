class Faculty
{
    int id;
    string name;
    int age;
    double weight;
    double height;

    public void GetFacultyDetails()
    {
        Console.Write("Enter ID: ");
        id = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Name: ");
        name = Console.ReadLine();

        Console.Write("Enter Age: ");
        age = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Weight: ");
        weight = Convert.ToDouble(Console.ReadLine());

        Console.Write("Enter Height: ");
        height = Convert.ToDouble(Console.ReadLine());
    }

    public void DisplayFacultyDetails()
    {
        Console.WriteLine("\nFaculty Details");
        Console.WriteLine("ID: " + id);
        Console.WriteLine("Name: " + name);
        Console.WriteLine("Age: " + age);
        Console.WriteLine("Weight: " + weight);
        Console.WriteLine("Height: " + height);
    }
}