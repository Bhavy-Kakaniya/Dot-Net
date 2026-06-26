// Write program to prompt a user to input his/her name and country name and then output will be shown as given: Hello <yourname> from country <countryname>
using System;
namespace MyApp;
class Program
{
    public static void Main(String[] args)
    {
        Console.WriteLine("Enter your name: ");
        String name = Console.ReadLine();
        Console.WriteLine("Enter your country name: ");
        String country_name = Console.ReadLine();
        Console.WriteLine("Hello, " + name + " from country " + country_name);
    }
}