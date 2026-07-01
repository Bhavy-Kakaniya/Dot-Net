class Faculty
{
    int id;
    String name;
    int age;
    double weight;
    double height;

    public void GetFacultyDetails()
    {
        Console.WriteLine("Enter faculty id: ");
        id = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Faculty Name: ");
        name = Console.ReadLine();

        Console.Write("Enter Faculty Age: ");
        age = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Faculty Weight: ");
        weight = Convert.ToDouble(Console.ReadLine());

        Console.Write("Enter Faculty Height: ");
        height = Convert.ToDouble(Console.ReadLine());
    }

    public void DisplayFacultyDetails()
    {
         Console.WriteLine("\nFaculty Details");
        Console.WriteLine("ID: " + id);
        Console.WriteLine("Name: " + name);
        Console.WriteLine("Age: " + age);
        Console.WriteLine("Weight: " + weight + " kg");
        Console.WriteLine("Height: " + height + " cm");
    }
}