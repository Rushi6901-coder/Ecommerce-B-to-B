namespace Ecommerce_B_to_B.Models
{
    public class SubCategory
    {
        public int SubCategoryId { get; set; }

        public int CategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public Category? Category { get; set; }
    }
}
