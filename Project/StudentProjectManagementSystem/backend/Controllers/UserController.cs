using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Models;
using StudentProjectManagementSystem.Services;

namespace StudentProjectManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileService _fileService;

        public UserController(ApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Faculty")]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserResponseDto>>>> GetAllUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;

                var users = await _context.Users
                    .Where(u => !u.IsDeleted)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
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
                    }).ToListAsync();

                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse("Users retrieved successfully", users));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<UserResponseDto>>.ErrorResponse($"An error occurred while retrieving users: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Faculty,Student")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> GetUserById([FromRoute] int id)
        {
            try
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
                    }).FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(ApiResponse<UserResponseDto>.ErrorResponse($"User with ID {id} not found"));
                }

                return Ok(ApiResponse<UserResponseDto>.SuccessResponse("User retrieved successfully", user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDto>.ErrorResponse($"An error occurred while retrieving user: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!await _context.UserTypes.AnyAsync(ut => ut.UserTypeId == dto.UserTypeId))
                {
                    return BadRequest(ApiResponse<UserResponseDto>.ErrorResponse("User Type does not exist"));
                }

                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return Conflict(ApiResponse<UserResponseDto>.ErrorResponse("Email already exists"));
                }

                var user = new User
                {
                    UserTypeId = dto.UserTypeId,
                    FullName = dto.FullName,
                    UserCode = dto.UserCode,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    MobileNumber = dto.MobileNumber,
                    ProfilePicturePath = dto.ProfilePicturePath ?? string.Empty,
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

                return CreatedAtAction("GetUserById", new { id = user.UserId }, ApiResponse<UserResponseDto>.SuccessResponse("User created successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDto>.ErrorResponse($"An error occurred while creating user: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Faculty,Student")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> UpdateUser([FromRoute] int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(ApiResponse<UserResponseDto>.ErrorResponse($"User with ID {id} not found"));
                }

                if (!await _context.UserTypes.AnyAsync(ut => ut.UserTypeId == dto.UserTypeId))
                {
                    return BadRequest(ApiResponse<UserResponseDto>.ErrorResponse("User Type does not exist"));
                }

                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.UserId != id))
                {
                    return Conflict(ApiResponse<UserResponseDto>.ErrorResponse("Email already exists"));
                }

                user.UserTypeId = dto.UserTypeId;
                user.FullName = dto.FullName;
                user.UserCode = dto.UserCode;
                user.Email = dto.Email;
                user.MobileNumber = dto.MobileNumber;
                user.ProfilePicturePath = dto.ProfilePicturePath ?? user.ProfilePicturePath;
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

                return Ok(ApiResponse<UserResponseDto>.SuccessResponse("User updated successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDto>.ErrorResponse($"An error occurred while updating user: {ex.Message}"));
            }
        }

        [HttpPost("{id}/profile-picture")]
        [Authorize(Roles = "Admin,Faculty,Student")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> UploadProfilePicture(
            [FromRoute] int id,
            [FromForm] ProfilePictureUploadDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null || user.IsDeleted)
                {
                    return NotFound(ApiResponse<UserResponseDto>.ErrorResponse($"User with ID {id} not found"));
                }

                if (dto.File == null || dto.File.Length == 0)
                {
                    return BadRequest(ApiResponse<UserResponseDto>.ErrorResponse("Uploaded file is invalid or empty"));
                }

                // Delete old profile picture if exists
                if (!string.IsNullOrWhiteSpace(user.ProfilePicturePath))
                {
                    _fileService.DeleteFile(user.ProfilePicturePath);
                }

                // Save new profile picture physically
                string relativePath = await _fileService.UploadFileAsync(dto.File, "ProfilePictures");
                user.ProfilePicturePath = relativePath;
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

                return Ok(ApiResponse<UserResponseDto>.SuccessResponse("Profile picture uploaded successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDto>.ErrorResponse($"An error occurred while uploading profile picture: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser([FromRoute] int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse($"User with ID {id} not found"));
                }

                if (!string.IsNullOrWhiteSpace(user.ProfilePicturePath))
                {
                    _fileService.DeleteFile(user.ProfilePicturePath);
                }

                user.IsDeleted = true;
                user.IsActive = false;
                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResponse("User deleted successfully", null!));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting user: {ex.Message}"));
            }
        }
    }
}