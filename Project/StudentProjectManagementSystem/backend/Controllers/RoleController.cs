using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Role;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [Authorize]
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
            try
            {
                var roles = await _context.Roles.Select(r => new RoleResponseDto
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description
                }).ToListAsync();

                return Ok(ApiResponse<IEnumerable<RoleResponseDto>>.SuccessResponse("Roles retrieved successfully", roles));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<RoleResponseDto>>.ErrorResponse($"An error occurred while retrieving roles: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> GetRoleById(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleResponseDto>.ErrorResponse($"An error occurred while retrieving role: {ex.Message}"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> CreateRole(CreateRoleDto dto)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleResponseDto>.ErrorResponse($"An error occurred while creating role: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> UpdateRole(int id, UpdateRoleDto dto)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleResponseDto>.ErrorResponse($"An error occurred while updating role: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteRole(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting role: {ex.Message}"));
            }
        }
    }
}