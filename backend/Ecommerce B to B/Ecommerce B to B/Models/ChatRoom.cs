namespace Ecommerce_B_to_B.Models
{
    public class ChatRoom
    {
        public int ChatRoomId { get; set; }

        public int VendorId { get; set; }
        public int ShopkeeperId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Vendor Vendor { get; set; }
        public Shopkeeper Shopkeeper { get; set; }

        public ICollection<Message> Messages { get; set; }
    }
}
