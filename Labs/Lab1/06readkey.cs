using System;
namespace Myapp
{
    class Program
    {
        public static void Main(String[] args)
        {
            while(true)
            {
                ConsoleKeyInfo key = Console.ReadKey();
                Console.WriteLine("you pressed : " + key.Key);
            }
        }
    }
}