using System.Collections.Generic;

namespace Ecommerce_B_to_B.Dto
{
    public class VendorInsightsDto
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public List<string> Categories { get; set; } = new List<string>();
        public List<string> SubCategories { get; set; } = new List<string>();
    }
}
