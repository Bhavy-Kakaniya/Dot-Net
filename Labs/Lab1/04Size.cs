//  Write a program to calculate the size of the area in square-feet based on Specified length and width.
using System;
namespace Myapp
{
    class Size
    {
        public static void Main(String[] args)
        {
            Console.Write("Enter length: ");
            int length = Convert.ToInt32(Console.ReadLine());
            Console.Write("Enter breadth: ");
            int breadth = Convert.ToInt32(Console.ReadLine());
            int area = length * breadth;
            Console.Write(area);
        }
    }
}