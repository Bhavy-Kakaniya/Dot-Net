using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.user;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserResponseDto>>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    UserTypeId = u.UserTypeId,
                    FullName = u.FullName,
                    UserCode = u.UserCode,
                    Email = u.Email,
                    MobileNumber = u.MobileNumber,
                    ProfilePicturePath = u.ProfilePicturePath,
                    IsActive = u.IsActive,
                    IsDeleted = u.IsDeleted
                })
                .ToListAsync();

            return Ok(
                ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(
                    "Users retrieved successfully",
                    users
                )
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(u => u.UserId == id)
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    UserTypeId = u.UserTypeId,
                    FullName = u.FullName,
                    UserCode = u.UserCode,
                    Email = u.Email,
                    MobileNumber = u.MobileNumber,
                    ProfilePicturePath = u.ProfilePicturePath,
                    IsActive = u.IsActive,
                    IsDeleted = u.IsDeleted
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        $"User with {id} not found"
                    )
                );
            }

            return Ok(
                ApiResponse<UserResponseDto>.SuccessResponse(
                    "User retrieved successfully",
                    user
                )
            );
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> CreateUser(
            CreateUserDto dto)
        {
            if (!await _context.UserTypes
                .AnyAsync(ut => ut.UserTypeId == dto.UserTypeId))
            {
                return BadRequest(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        "User Type does not exist"
                    )
                );
            }

            if (await _context.Users
                .AnyAsync(u => u.Email == dto.Email))
            {
                return Conflict(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        "Email already exists"
                    )
                );
            }

            var user = new User
            {
                UserTypeId = dto.UserTypeId,
                FullName = dto.FullName,
                UserCode = dto.UserCode,
                Email = dto.Email,
                PasswordHash = dto.Password,
                MobileNumber = dto.MobileNumber,
                ProfilePicturePath = dto.ProfilePicturePath,
                IsActive = true,
                IsDeleted = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = new UserResponseDto
            {
                UserId = user.UserId,
                UserTypeId = user.UserTypeId,
                FullName = user.FullName,
                UserCode = user.UserCode,
                Email = user.Email,
                MobileNumber = user.MobileNumber,
                ProfilePicturePath = user.ProfilePicturePath,
                IsActive = user.IsActive,
                IsDeleted = user.IsDeleted
            };

            return CreatedAtAction(
                nameof(GetUserById),
                new { id = user.UserId },
                ApiResponse<UserResponseDto>.SuccessResponse(
                    "User created successfully",
                    response
                )
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> UpdateUser(
            int id,
            UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        $"User with {id} not found"
                    )
                );
            }

            if (!await _context.UserTypes
                .AnyAsync(ut => ut.UserTypeId == dto.UserTypeId))
            {
                return BadRequest(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        "User Type does not exist"
                    )
                );
            }

            if (await _context.Users
                .AnyAsync(u => u.Email == dto.Email && u.UserId != id))
            {
                return Conflict(
                    ApiResponse<UserResponseDto>.ErrorResponse(
                        "Email already exists"
                    )
                );
            }

            user.UserTypeId = dto.UserTypeId;
            user.FullName = dto.FullName;
            user.UserCode = dto.UserCode;
            user.Email = dto.Email;
            user.MobileNumber = dto.MobileNumber;
            user.ProfilePicturePath = dto.ProfilePicturePath;
            user.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            var response = new UserResponseDto
            {
                UserId = user.UserId,
                UserTypeId = user.UserTypeId,
                FullName = user.FullName,
                UserCode = user.UserCode,
                Email = user.Email,
                MobileNumber = user.MobileNumber,
                ProfilePicturePath = user.ProfilePicturePath,
                IsActive = user.IsActive,
                IsDeleted = user.IsDeleted
            };

            return Ok(
                ApiResponse<UserResponseDto>.SuccessResponse(
                    "User updated successfully",
                    response
                )
            );
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(
                    ApiResponse<object>.ErrorResponse(
                        $"User with {id} not found"
                    )
                );
            }

            // Soft delete
            user.IsDeleted = true;
            user.IsActive = false;

            await _context.SaveChangesAsync();

            return Ok(
                ApiResponse<object>.SuccessResponse(
                    "User deleted successfully",
                    null!
                )
            );
        }
    }
}