namespace Ecommerce_B_to_B.Models
{
    public class Message
    {
        public int MessageId { get; set; }

        public int ChatRoomId { get; set; }

        public int SenderId { get; set; }
        public string SenderRole { get; set; } // Vendor / Shopkeeper

        public string MessageType { get; set; } // Text / Invoice / Estimation
        public string Content { get; set; }

        public int? OrderId { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public ChatRoom ChatRoom { get; set; }
        public Order Order { get; set; }
    }
}
