namespace Ecommerce_B_to_B.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public int VendorId { get; set; }
        public int ShopkeeperId { get; set; }

        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; } // Estimated / Pending / Paid

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
