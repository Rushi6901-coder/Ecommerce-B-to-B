using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Models;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public SeedController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpPost("categories")]
        public async Task<IActionResult> SeedCategories()
        {
            if (await _context.Categories.AnyAsync(c => c.CategoryName != "Electronics"))
            {
                return BadRequest("Categories already seeded (more than just test 'Electronics' found)");
            }

            var electronics = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Electronics");
            if (electronics == null)
            {
                electronics = new Category { CategoryName = "Electronics" };
                _context.Categories.Add(electronics);
                await _context.SaveChangesAsync();
            }

            var demoData = new Dictionary<string, string[]>
            {
                { "Electronics", new[] { "Mobile", "Laptop", "Headphones" } },
                { "Fashion", new[] { "Clothing", "Footwear", "Accessories" } },
                { "Home & Kitchen", new[] { "Appliances", "Furniture", "Decor" } },
                { "Sports & Fitness", new[] { "Gym Equipment", "Outdoor Sports", "Yoga & Fitness" } },
                { "Books & Stationery", new[] { "Office Supplies", "Books", "Art Supplies" } },
                { "Automotive", new[] { "Car Accessories", "Car Care", "Tools" } }
            };

            foreach (var entry in demoData)
            {
                var catName = entry.Key;
                var subCats = entry.Value;

                var category = await _context.Categories.Include(c => c.SubCategories)
                    .FirstOrDefaultAsync(c => c.CategoryName == catName);
                
                if (category == null)
                {
                    category = new Category { CategoryName = catName };
                    _context.Categories.Add(category);
                    await _context.SaveChangesAsync();
                }

                foreach (var subName in subCats)
                {
                    if (category.SubCategories == null || !category.SubCategories.Any(s => s.SubCategoryName == subName))
                    {
                        var sc = new SubCategory 
                        { 
                            SubCategoryName = subName, 
                            CategoryId = category.CategoryId,
                            IsActive = true
                        };
                        _context.SubCategories.Add(sc);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok("Database seeded with demo categories and subcategories successfully!");
        }
    }
}
