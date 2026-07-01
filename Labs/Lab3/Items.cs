class Item
{
    public int Item_Code;
    public string Item_Name;
    public int Stock_Quantity;

    public Item(int code, string name, int quantity)
    {
        Item_Code = code;
        Item_Name = name;
        Stock_Quantity = quantity;
    }

    public void DisplayItem()
    {
        Console.WriteLine(Item_Code + " " + Item_Name + "\t\t" + Stock_Quantity);
    }
}