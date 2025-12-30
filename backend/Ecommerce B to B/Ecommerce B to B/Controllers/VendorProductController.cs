using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Dto;
using Ecommerce_B_to_B.Models;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorProductController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public VendorProductController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet("{vendorId}")]
        public async Task<ActionResult<IEnumerable<ProductDisplayDto>>> GetVendorProducts(int vendorId)
        {
            return await _context.Products
                .Where(p => p.VendorId == vendorId)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Select(p => new ProductDisplayDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Discount = p.Discount,
                    Stock = p.Stock,
                    CategoryName = p.Category != null ? p.Category.CategoryName : "N/A",
                    SubCategoryName = p.SubCategory != null ? p.SubCategory.SubCategoryName : "N/A",
                    VendorId = p.VendorId
                })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromBody] ProductCreateDto productDto)
        {
            var product = new Product
            {
                ProductName = productDto.ProductName,
                Price = productDto.Price,
                Discount = productDto.Discount,
                Stock = productDto.Stock,
                VendorId = productDto.VendorId,
                CategoryId = productDto.CategoryId,
                SubCategoryId = productDto.SubCategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] ProductCreateDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.ProductName = productDto.ProductName;
            product.Price = productDto.Price;
            product.Discount = productDto.Discount;
            product.Stock = productDto.Stock;
            product.CategoryId = productDto.CategoryId;
            product.SubCategoryId = productDto.SubCategoryId;

            await _context.SaveChangesAsync();
            return NoContent();
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
