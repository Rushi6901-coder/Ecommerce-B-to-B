namespace Ecommerce_B_to_B.DTOs
{
    public class SendInvoiceDto
    {
        public int ChatRoomId { get; set; }

        public int VendorId { get; set; }
        public int ShopkeeperId { get; set; }

        public decimal TotalAmount { get; set; }
        public string MessageType { get; set; } // Invoice / Estimation
        public string Content { get; set; }     // Bill / estimation text
    }
}

