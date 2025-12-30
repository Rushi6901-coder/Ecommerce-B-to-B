using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Dto;
using Ecommerce_B_to_B.Models;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminProductController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AdminProductController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDisplayDto>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.Vendor)
                .Select(p => new ProductDisplayDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Discount = p.Discount,
                    Stock = p.Stock,
                    CategoryName = p.Category != null ? p.Category.CategoryName : "N/A",
                    SubCategoryName = p.SubCategory != null ? p.SubCategory.SubCategoryName : "N/A",
                    VendorName = p.Vendor != null ? p.Vendor.Name : "N/A",
                    ShopName = p.Vendor != null ? p.Vendor.ShopName : "N/A",
                    VendorId = p.VendorId
                })
                .ToListAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
