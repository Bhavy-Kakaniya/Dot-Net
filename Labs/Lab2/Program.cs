class Program
{
    public static void Main(string[] args)
    {
        // 1. Change case of single character

        // Console.WriteLine("Enter key: ");
        // char ch = Console.ReadKey().KeyChar;
        // if(char.IsUpper(ch))
        // {
        //     Console.WriteLine(char.ToLower(ch));
        // }
        // else if(char.IsLower(ch)){
        //     Console.WriteLine(char.ToUpper(ch));
        // }

        // 2. Toggle Case of Every Character in a String

        // Console.WriteLine("Enter string:    ");
        // string s = Console.ReadLine();
        // char[] chars = input.ToCharArray();
        // for (int i = 0; i < chars.Length; i++)
        // {
        //     if (char.IsUpper(chars[i]))
        //         chars[i] = char.ToLower(chars[i]);
        //     else if (char.IsLower(chars[i]))
        //         chars[i] = char.ToUpper(chars[i]);
        //     Console.WriteLine(chars);
        // }

        // 3. Check if String 2 is Contained in String 1
        // Console.WriteLine("Enter s1: ");
        // string s1 = Console.ReadLine();
        // Console.WriteLine("Enter s2: ");
        // string s2 = Console.ReadLine();
        // if (s2.Contains(s1))
        // {
        //     Console.WriteLine("contains");
        // }
        // else {
        //     Console.WriteLine("contains");
        // }

        // 4. Second largest in array

        // int largest = int.MinValue;
        // int secondLargest = int.MinValue;

        // foreach (int num in arr)
        // {
        //     if (num > largest)
        //     {
        //         secondLargest = largest;
        //         largest = num;
        //     }
        //     else if (num > secondLargest && num != largest)
        //     {
        //         secondLargest = num;
        //     }
        // }
        // Console.WriteLine(secondLargest);

        // 5. Simple calculator if else

        // Console.Write("Enter first number: ");
        // int num1 = Convert.ToInt32(Console.ReadLine());
        // Console.Write("Enter an operator (+, -, *, /): ");
        // char op = Convert.ToChar(Console.ReadLine());
        // Console.Write("Enter second number: ");
        // int num2 = Convert.ToInt32(Console.ReadLine());
        // if (op == '+')
        //     Console.WriteLine("Result = " + (num1 + num2));
        // else if (op == '-')
        //     Console.WriteLine("Result = " + (num1 - num2));
        // else if (op == '*')
        //     Console.WriteLine("Result = " + (num1 * num2));
        // else if (op == '/')
        // {
        //     if (num2 != 0)
        //         Console.WriteLine("Result = " + (num1 / num2));
        //     else
        //         Console.WriteLine("Error: Division by zero is not allowed.");
        // }
        // else
        //     Console.WriteLine("Invalid");


        // 6. Sum of All Elements in an Array

        // int[] arr = { 10, 20, 30, 40, 50 };
        // int sum = 0;
        // foreach (int num in arr)
        // {
        //     sum += num;
        // }
        // Console.WriteLine("Sum of all elements = " + sum);

        // 7. Count Odd and Even Numbers in an Array

        // int[] arr = { 10, 20, 30, 40, 50 };
        // int count_even = 0;
        // int count_odd = 0;
        // foreach (int num in arr)
        // {
        // if (num % 2 == 0)
        //     count_even++;
        // else count_odd++;
        //     sum += num;
        // }
        // Console.WriteLine("Sum of all elements = " + sum);

        // 8. Find First & Last Occurrence of a Character and Replace with 'D'
        // Console.Write("Enter string: ");
        // string str = Console.ReadLine();
        // Console.Write("Enter character to find: ");
        // char ch = Convert.ToChar(Console.ReadLine());
        // int first = str.IndexOf(ch);
        // int last = str.LastIndexOf(ch);
        // char[] chars = str.ToCharArray();
        // chars[first] = 'D';
        // chars[last] = 'D';
        // string result = new string(chars);
        // Console.WriteLine(result);


    }
}