namespace Ecommerce_B_to_B.DTOs
{
    public class RegisterShopkeeperDto
    {
        public string Name { get; set; }
        public string ShopName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginShopkeeperDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class StartChatDto
    {
        public int VendorId { get; set; }
        public int ShopkeeperId { get; set; }
    }
}