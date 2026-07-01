class Car
{
    public string Make;
    public string Model;
    public int Year;
    public string FuelType;
    public int Horsepower;

    public Car(string make, string model, int year, string fuelType, int horsepower)
    {
        Make = make;
        Model = model;
        Year = year;
        FuelType = fuelType;
        Horsepower = horsepower;
    }

    public void DisplayCarDetails()
    {
        Console.WriteLine("Car Details");
        Console.WriteLine("Make : " + Make);
        Console.WriteLine("Model : " + Model);
        Console.WriteLine("Year : " + Year);
        Console.WriteLine("Fuel Type : " + FuelType);
        Console.WriteLine("Horsepower : " + Horsepower + " HP");
    }
}