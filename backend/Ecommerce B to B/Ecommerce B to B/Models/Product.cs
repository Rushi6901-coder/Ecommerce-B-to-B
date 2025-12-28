namespace Ecommerce_B_to_B.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        public int VendorId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }

        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public int Stock { get; set; }

        public Vendor Vendor { get; set; }
        public Category Category { get; set; }
        public SubCategory SubCategory { get; set; }
    }
}
