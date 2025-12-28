namespace Ecommerce_B_to_B.Models
{
    public class Vendor
    {
        public int VendorId { get; set; }

        public string Name { get; set; }
        public string ShopName { get; set; }

        public ICollection<Product> Products { get; set; }
        public ICollection<ChatRoom> ChatRooms { get; set; }
    }
}
