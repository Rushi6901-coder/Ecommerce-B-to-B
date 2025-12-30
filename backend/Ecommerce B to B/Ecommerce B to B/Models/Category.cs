using System.ComponentModel.DataAnnotations;

namespace Ecommerce_B_to_B.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        
        [Required]
        public string CategoryName { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public ICollection<SubCategory>? SubCategories { get; set; }
    }
}
