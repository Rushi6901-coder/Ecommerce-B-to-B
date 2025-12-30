namespace Ecommerce_B_to_B.Dto
{
    public class ProductDisplayDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public int Stock { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string SubCategoryName { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public int VendorId { get; set; }
    }

    public class ProductCreateDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public int Stock { get; set; }
        public int VendorId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
    }
}
