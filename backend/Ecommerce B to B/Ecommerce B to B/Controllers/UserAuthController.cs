using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Dto;
using Ecommerce_B_to_B.Models;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public UserAuthController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // 1. Check Vendors
            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.Email == loginDto.Email && v.Password == loginDto.Password && !v.IsDeleted);

            if (vendor != null)
            {
                if (!vendor.IsActive)
                {
                    return BadRequest(new { message = "Account is inactive. Please contact admin." });
                }

                return Ok(new
                {
                    id = vendor.VendorId,
                    name = vendor.Name,
                    email = vendor.Email,
                    role = "vendor",
                    shopName = vendor.ShopName
                });
            }

            // 2. Check Shopkeepers
            var shopkeeper = await _context.Shopkeepers
                .FirstOrDefaultAsync(s => s.Email == loginDto.Email && s.Password == loginDto.Password && !s.IsDeleted);

            if (shopkeeper != null)
            {
                if (!shopkeeper.IsActive)
                {
                    return BadRequest(new { message = "Account is inactive. Please contact admin." });
                }

                return Ok(new
                {
                    id = shopkeeper.ShopkeeperId,
                    name = shopkeeper.Name,
                    email = shopkeeper.Email,
                    role = "shopkeeper",
                    shopName = shopkeeper.ShopName
                });
            }

            return Unauthorized(new { message = "Invalid email or password" });
        }
    }
}
