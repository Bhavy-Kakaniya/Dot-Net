// Write a program to calculate area of Square, Rectangle and Circle.
using System;
namespace Area
{
    class Rectangle
    {
        public void area()
        {
            Console.WriteLine("Enter length: ");
            int length = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Enter breadth: ");
            int breadth = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("area is " + (length * breadth));
        }
    }
    class Sqaure
    {
        public void area()
        {
            Console.WriteLine("Enter length: ");
            int length = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("area is " + (length * length));
        }
    }
    class Circle
    {
        public void area()
        {
            Console.WriteLine("Enter radius: ");
            int radius = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("area is " + (Math.PI * radius * radius));
        }
    }
    class Program
    {
        static void Main(String[] args)
        {
            Rectangle r = new Rectangle();
            r.area();
            Sqaure s = new Sqaure();
            s.area();
            Circle c = new Circle();
            c.area();
        }
    }
}