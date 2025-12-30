namespace Ecommerce_B_to_B.Dto
{
    public class ShopkeeperDisplayDto
    {
        public int ShopkeeperId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
