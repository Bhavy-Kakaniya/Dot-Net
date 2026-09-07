using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Role;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoleResponseDto>>>> GetAllRoles()
        {
            var roles = await _context.Roles.Select(r => new RoleResponseDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                Description = r.Description
            }).ToListAsync();

            return Ok(ApiResponse<IEnumerable<RoleResponseDto>>.SuccessResponse("Roles retrieved successfully", roles));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> GetRoleById(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(ApiResponse<RoleResponseDto>.ErrorResponse($"Role with {id} not found"));
            }

            var response = new RoleResponseDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };
            return Ok(ApiResponse<RoleResponseDto>.SuccessResponse("Role retrieved successfully", response));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> CreateRole(CreateRoleDto dto)
        {
            var role = new Role
            {
                RoleName = dto.RoleName,
                Description = dto.Description
            };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            var response = new RoleResponseDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };
            return CreatedAtAction(nameof(GetRoleById), new { id = role.RoleId }, ApiResponse<RoleResponseDto>.SuccessResponse("Role created successfully", response));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> UpdateRole(int id, UpdateRoleDto dto)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(ApiResponse<RoleResponseDto>.ErrorResponse($"Role with {id} not found"));
            }

            role.RoleName = dto.RoleName;
            role.Description = dto.Description;
            await _context.SaveChangesAsync();

            var response = new RoleResponseDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };
            return Ok(ApiResponse<RoleResponseDto>.SuccessResponse("Role updated successfully", response));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Role with {id} not found"));
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Role deleted successfully", null!));
        }
    }
}