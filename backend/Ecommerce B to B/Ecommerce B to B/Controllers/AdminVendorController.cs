using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Models;
using Ecommerce_B_to_B.Dto;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminVendorController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AdminVendorController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/AdminVendor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendorDisplayDto>>> GetVendors()
        {
            var vendors = await _context.Vendors
                .Where(v => !v.IsDeleted)
                .Select(v => new VendorDisplayDto {
                    OriginalId = v.VendorId,
                    Name = v.Name,
                    ShopName = v.ShopName,
                    Email = v.Email ?? "",
                    Phone = v.Phone ?? "",
                    Type = "Vendor",
                    IsActive = v.IsActive
                }).ToListAsync();

            // Assign a unique sequential ID for frontend keying
            for (int i = 0; i < vendors.Count; i++) {
                vendors[i].Id = i + 1;
            }

            return vendors;
        }

        // GET: api/AdminVendor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vendor>> GetVendor(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);

            if (vendor == null || vendor.IsDeleted)
            {
                return NotFound();
            }

            return vendor;
        }

        // POST: api/AdminVendor
        [HttpPost]
        public async Task<ActionResult<Vendor>> PostVendor([FromBody] VendorCreateDto dto)
        {
            var vendor = new Vendor
            {
                Name = dto.Name,
                ShopName = dto.ShopName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,
                IsActive = true,
                IsDeleted = false
            };
            
            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVendor", new { id = vendor.VendorId }, vendor);
        }

        // PUT: api/AdminVendor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVendor(int id, Vendor vendor)
        {
            if (id != vendor.VendorId)
            {
                return BadRequest();
            }

            _context.Entry(vendor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VendorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        // PUT: api/AdminVendor/Activate/5
        [HttpPut("Activate/{id}")]
        public async Task<IActionResult> ToggleActivation(int id)
        {
             var vendor = await _context.Vendors.FindAsync(id);
             if(vendor == null) return NotFound();
             
             vendor.IsActive = !vendor.IsActive; // Toggle
             _context.Entry(vendor).State = EntityState.Modified;
             await _context.SaveChangesAsync();
             
             return NoContent();
        }

        // DELETE: api/AdminVendor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendor(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor == null)
            {
                return NotFound();
            }

            vendor.IsDeleted = true;
            _context.Entry(vendor).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/AdminVendor/Insights/5
        [HttpGet("Insights/{id}")]
        public async Task<ActionResult<VendorInsightsDto>> GetVendorInsights(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor == null) return NotFound();

            var categories = await _context.Products
                .Where(p => p.VendorId == id)
                .Include(p => p.Category)
                .Select(p => p.Category.CategoryName)
                .Distinct()
                .ToListAsync();

            var subCategories = await _context.Products
                .Where(p => p.VendorId == id)
                .Include(p => p.SubCategory)
                .Select(p => p.SubCategory.SubCategoryName)
                .Distinct()
                .ToListAsync();

            return new VendorInsightsDto
            {
                VendorId = id,
                VendorName = vendor.Name,
                Categories = categories,
                SubCategories = subCategories
            };
        }

        private bool VendorExists(int id)
        {
            return _context.Vendors.Any(e => e.VendorId == id && !e.IsDeleted);
        }
    }
}
