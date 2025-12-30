using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.Dto;

namespace Ecommerce_B_to_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AdminAuthController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Email == loginDto.Email && a.Password == loginDto.Password);

            if (admin == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(new { 
                id = admin.AdminId, 
                name = admin.Name, 
                email = admin.Email,
                role = "admin"
            });
        }
    }
}
