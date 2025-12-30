using System.ComponentModel.DataAnnotations;

namespace Ecommerce_B_to_B.Models
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string State { get; set; } = string.Empty;
    }
}
