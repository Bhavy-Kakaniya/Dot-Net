class Patient
{
    public int Patient_ID;
    public string Name;
    public int Age;
    public string Disease;

    public void GetPatientDetails()
    {
        Console.Write("Enter Patient ID: ");
        Patient_ID = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Patient Name: ");
        Name = Console.ReadLine();

        Console.Write("Enter Age: ");
        Age = Convert.ToInt32(Console.ReadLine());

        Console.Write("Enter Disease: ");
        Disease = Console.ReadLine();
    }

    public void DisplayPatientDetails()
    {
        Console.WriteLine(Patient_ID + " " + Name + "\t" + Age + "\t" + Disease);
    }
}