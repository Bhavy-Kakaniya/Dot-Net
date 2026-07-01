class Employee
{
    int Emp_ID;
    string Name;
    string Department;
    string Designation;
    double Salary;

    public void GetEmpDetails()
    {
        Console.Write("Enter Employee ID: ");
        Emp_ID = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Name: ");
        Name = Console.ReadLine();

        Console.Write("Enter Department: ");
        Department = Console.ReadLine();

        Console.Write("Enter Designation: ");
        Designation = Console.ReadLine();

        Console.Write("Enter Salary: ");
        Salary = Convert.ToDouble(Console.ReadLine());
    }

    public void DisplayEmpDetails()
    {
        Console.WriteLine("\nEmployee ID : " + Emp_ID);
        Console.WriteLine("Name : " + Name);
        Console.WriteLine("Department : " + Department);
        Console.WriteLine("Designation : " + Designation);
        Console.WriteLine("Salary : " + Salary);
    }
}