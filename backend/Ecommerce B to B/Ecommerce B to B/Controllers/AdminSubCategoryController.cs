using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Models;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminSubCategoryController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AdminSubCategoryController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/AdminSubCategory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
        {
            return await _context.SubCategories
                .Include(s => s.Category)
                .Where(s => !s.IsDeleted)
                .ToListAsync();
        }

        // GET: api/AdminSubCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategory>> GetSubCategory(int id)
        {
            var subCategory = await _context.SubCategories
                .Include(s => s.Category)
                .FirstOrDefaultAsync(m => m.SubCategoryId == id);

            if (subCategory == null || subCategory.IsDeleted)
            {
                return NotFound();
            }

            return subCategory;
        }

        // POST: api/AdminSubCategory
        [HttpPost]
        public async Task<ActionResult<SubCategory>> PostSubCategory(SubCategory subCategory)
        {
            subCategory.IsActive = true;
            subCategory.IsDeleted = false;
            // Ensure Category exists? EF will check foreign key constraint.
            // Avoid setting Navigation property if passed to avoid confusion, focus on CategoryId
             subCategory.Category = null; 

            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubCategory", new { id = subCategory.SubCategoryId }, subCategory);
        }

        // PUT: api/AdminSubCategory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubCategory(int id, SubCategory subCategory)
        {
            if (id != subCategory.SubCategoryId)
            {
                return BadRequest();
            }

            _context.Entry(subCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubCategoryExists(id))
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

        // DELETE: api/AdminSubCategory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null)
            {
                return NotFound();
            }

            subCategory.IsDeleted = true;
            _context.Entry(subCategory).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubCategoryExists(int id)
        {
            return _context.SubCategories.Any(e => e.SubCategoryId == id && !e.IsDeleted);
        }
    }
}
