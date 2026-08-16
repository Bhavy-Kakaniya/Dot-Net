using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Role;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;

        public RoleController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoleResponseDto>>>> GetAllRoles()
        {
            var roles = await _roleRepository.GetAllRolesAsync();
            var response = roles.Select(r => new RoleResponseDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                Description = r.Description
            });
            return Ok(ApiResponse<IEnumerable<RoleResponseDto>>.SuccessResponse("Roles retrieved successfully", response));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> GetRoleById(int id)
        {
            var role = await _roleRepository.GetRoleByIdAsync(id);
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

        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> CreateRole(CreateRoleDto createRoleDto)
        {
            var role = new Role
            {
                RoleName = createRoleDto.RoleName,
                Description = createRoleDto.Description
            };
            await _roleRepository.CreateRoleAsync(role);
            var response = new RoleResponseDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };

            return CreatedAtAction(
                nameof(GetRoleById),
                new { id = role.RoleId },
                ApiResponse<RoleResponseDto>.SuccessResponse("Role created successfully", response)
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RoleResponseDto>>> UpdateRole(int id, UpdateRoleDto updateRoleDto)
        {
            var role = await _roleRepository.GetRoleByIdAsync(id);
            if (role == null)
            {
                return NotFound(ApiResponse<RoleResponseDto>.ErrorResponse($"Role with {id} not found"));
            }
            role.RoleName = updateRoleDto.RoleName;
            role.Description = updateRoleDto.Description;
            await _roleRepository.UpdateRoleAsync(role);
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
            var deleted = await _roleRepository.DeleteRoleAsync(id);
            if (!deleted)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Role with {id} not found"));
            }
            return Ok(ApiResponse<object>.SuccessResponse("Role deleted successfully", null!));
        }
    }
}