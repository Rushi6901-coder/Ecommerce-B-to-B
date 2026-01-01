namespace Ecommerce_B_to_B.Models
{
    public class Shopkeeper
    {
        public int ShopkeeperId { get; set; }

        public string Name { get; set; }
        public string ShopName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public int? LocationId { get; set; }
        public Location? Location { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public ICollection<ChatRoom>? ChatRooms { get; set; }
    }
}
