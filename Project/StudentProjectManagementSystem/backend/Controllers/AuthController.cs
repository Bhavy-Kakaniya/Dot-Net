using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Services;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginDto dto)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserType)
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsDeleted == false);

                if (user == null)
                {
                    return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse("Invalid email or password"));
                }
                if (user.IsActive == false)
                {
                    return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse("Account is deactivated"));
                }
                bool passwordMatch = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
                if (!passwordMatch)
                {
                    return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse("Invalid email or password"));
                }
                var roles = new List<string>();
                foreach (var userRole in user.UserRoles)
                {
                    if (userRole.Role != null)
                    {
                        roles.Add(userRole.Role.RoleName);
                    }
                }            
                var token = _tokenService.GenerateToken(user, roles);

                var response = new LoginResponseDto
                {
                    Token = token,
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    UserType = user.UserType != null ? user.UserType.UserTypeName : "",
                    Roles = roles
                };

                return Ok(ApiResponse<LoginResponseDto>.SuccessResponse("Login successful", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<LoginResponseDto>.ErrorResponse($"An error occurred during login: {ex.Message}"));
            }
        }
    }
}
