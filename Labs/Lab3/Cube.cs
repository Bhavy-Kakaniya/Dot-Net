class Cube
{
    private double side;
    private double volume;

    public Cube(double s)
    {
        side = s;
        volume = side * side * side;
    }

    public void DisplayVolume()
    {
        Console.WriteLine("Side of Cube: " + side);
        Console.WriteLine("Volume of Cube: " + volume);
    }
}