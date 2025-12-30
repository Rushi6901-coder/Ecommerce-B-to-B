namespace Ecommerce_B_to_B.Dto
{
    public class VendorDisplayDto
    {
        public int Id { get; set; } // Sequential ID for frontend
        public int OriginalId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Vendor" or "Shopkeeper"
        public bool IsActive { get; set; }
    }
}
