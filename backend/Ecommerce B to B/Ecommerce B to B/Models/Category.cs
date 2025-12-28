namespace Ecommerce_B_to_B.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        public ICollection<SubCategory> SubCategories { get; set; }
    }
}
