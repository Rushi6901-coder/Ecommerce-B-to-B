using System.ComponentModel.DataAnnotations;

namespace Ecommerce_B_to_B.Models
{
    public class Admin
    {
        public int AdminId { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
