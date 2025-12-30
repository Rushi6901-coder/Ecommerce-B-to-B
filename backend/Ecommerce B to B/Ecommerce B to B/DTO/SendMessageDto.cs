namespace Ecommerce_B_to_B.DTOs
{
    public class SendMessageDto
    {
        public int ChatRoomId { get; set; }
        public int SenderId { get; set; }
        public string SenderRole { get; set; } // Vendor / Shopkeeper
        public string Content { get; set; }
    }
}
