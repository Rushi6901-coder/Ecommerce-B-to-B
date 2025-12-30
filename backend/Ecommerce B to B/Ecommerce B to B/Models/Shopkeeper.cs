namespace Ecommerce_B_to_B.Models
{
    public class Shopkeeper
    {
        public int ShopkeeperId { get; set; }

        public string Name { get; set; }
        public string ShopName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public ICollection<ChatRoom> ChatRooms { get; set; }
    }
}
