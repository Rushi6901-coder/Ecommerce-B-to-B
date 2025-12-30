using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Models;
using Ecommerce_B_to_B.Dto;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminShopkeeperController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AdminShopkeeperController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/AdminShopkeeper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShopkeeperDisplayDto>>> GetShopkeepers()
        {
            return await _context.Shopkeepers
                .Where(s => !s.IsDeleted)
                .Select(s => new ShopkeeperDisplayDto {
                    ShopkeeperId = s.ShopkeeperId,
                    Name = s.Name,
                    ShopName = s.ShopName,
                    Email = s.Email ?? "",
                    Phone = s.Phone ?? "",
                    IsActive = s.IsActive
                })
                .ToListAsync();
        }

        // GET: api/AdminShopkeeper/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shopkeeper>> GetShopkeeper(int id)
        {
            var shopkeeper = await _context.Shopkeepers.FindAsync(id);

            if (shopkeeper == null || shopkeeper.IsDeleted)
            {
                return NotFound();
            }

            return shopkeeper;
        }

        // POST: api/AdminShopkeeper
        [HttpPost]
        public async Task<ActionResult<Shopkeeper>> PostShopkeeper([FromBody] ShopkeeperCreateDto dto)
        {
            var shopkeeper = new Shopkeeper
            {
                Name = dto.Name,
                ShopName = dto.ShopName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,
                IsActive = true,
                IsDeleted = false
            };

            _context.Shopkeepers.Add(shopkeeper);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShopkeeper", new { id = shopkeeper.ShopkeeperId }, shopkeeper);
        }

        // PUT: api/AdminShopkeeper/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShopkeeper(int id, Shopkeeper shopkeeper)
        {
            if (id != shopkeeper.ShopkeeperId)
            {
                return BadRequest();
            }

            _context.Entry(shopkeeper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShopkeeperExists(id))
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
        
        // PUT: api/AdminShopkeeper/Activate/5
        [HttpPut("Activate/{id}")]
        public async Task<IActionResult> ToggleActivation(int id)
        {
             var shopkeeper = await _context.Shopkeepers.FindAsync(id);
             if(shopkeeper == null) return NotFound();
             
             shopkeeper.IsActive = !shopkeeper.IsActive; // Toggle
             _context.Entry(shopkeeper).State = EntityState.Modified;
             await _context.SaveChangesAsync();
             
             return NoContent();
        }

        // DELETE: api/AdminShopkeeper/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopkeeper(int id)
        {
            var shopkeeper = await _context.Shopkeepers.FindAsync(id);
            if (shopkeeper == null)
            {
                return NotFound();
            }

            shopkeeper.IsDeleted = true;
            _context.Entry(shopkeeper).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShopkeeperExists(int id)
        {
            return _context.Shopkeepers.Any(e => e.ShopkeeperId == id && !e.IsDeleted);
        }
    }
}
