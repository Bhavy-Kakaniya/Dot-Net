using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.UserRole;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserRoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserRoleResponseDto>>>> GetAllUserRoles()
        {
            var userRoles = await _context.UserRoles.Select(ur => new UserRoleResponseDto
            {
                RolePermissionId = ur.RolePermissionId,
                UserId = ur.UserId,
                RoleId = ur.RoleId
            }).ToListAsync();

            return Ok(ApiResponse<IEnumerable<UserRoleResponseDto>>.SuccessResponse("User roles retrieved successfully", userRoles));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> GetUserRoleById(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);
            if (userRole == null)
            {
                return NotFound(ApiResponse<UserRoleResponseDto>.ErrorResponse($"UserRole with {id} not found"));
            }

            var response = new UserRoleResponseDto
            {
                RolePermissionId = userRole.RolePermissionId,
                UserId = userRole.UserId,
                RoleId = userRole.RoleId
            };
            return Ok(ApiResponse<UserRoleResponseDto>.SuccessResponse("User role retrieved successfully", response));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> CreateUserRole(CreateUserRoleDto dto)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == dto.UserId))
            {
                return BadRequest(ApiResponse<UserRoleResponseDto>.ErrorResponse("User does not exist"));
            }

            if (!await _context.Roles.AnyAsync(r => r.RoleId == dto.RoleId))
            {
                return BadRequest(ApiResponse<UserRoleResponseDto>.ErrorResponse("Role does not exist"));
            }

            var userRole = new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId
            };
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            var response = new UserRoleResponseDto
            {
                RolePermissionId = userRole.RolePermissionId,
                UserId = userRole.UserId,
                RoleId = userRole.RoleId
            };
            return CreatedAtAction(nameof(GetUserRoleById), new { id = userRole.RolePermissionId }, ApiResponse<UserRoleResponseDto>.SuccessResponse("User role created successfully", response));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> UpdateUserRole(int id, UpdateUserRoleDto dto)
        {
            var userRole = await _context.UserRoles.FindAsync(id);
            if (userRole == null)
            {
                return NotFound(ApiResponse<UserRoleResponseDto>.ErrorResponse($"UserRole with {id} not found"));
            }

            if (!await _context.Users.AnyAsync(u => u.UserId == dto.UserId))
            {
                return BadRequest(ApiResponse<UserRoleResponseDto>.ErrorResponse("User does not exist"));
            }

            if (!await _context.Roles.AnyAsync(r => r.RoleId == dto.RoleId))
            {
                return BadRequest(ApiResponse<UserRoleResponseDto>.ErrorResponse("Role does not exist"));
            }

            userRole.UserId = dto.UserId;
            userRole.RoleId = dto.RoleId;
            await _context.SaveChangesAsync();

            var response = new UserRoleResponseDto
            {
                RolePermissionId = userRole.RolePermissionId,
                UserId = userRole.UserId,
                RoleId = userRole.RoleId
            };
            return Ok(ApiResponse<UserRoleResponseDto>.SuccessResponse("User role updated successfully", response));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUserRole(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);
            if (userRole == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"UserRole with {id} not found"));
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<object>.SuccessResponse("User role deleted successfully", null!));
        }
    }
}