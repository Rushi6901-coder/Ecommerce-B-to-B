namespace Ecommerce_B_to_B.Dto
{
    public class VendorCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = "123"; // Default password
    }
}
