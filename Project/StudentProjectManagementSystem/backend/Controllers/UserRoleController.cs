using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.UserRole;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleRepository _userRoleRepository;

        public UserRoleController(IUserRoleRepository userRoleRepository)
        {
            _userRoleRepository = userRoleRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserRoleResponseDto>>>> GetAllUserRoles()
        {
            var userRoles = await _userRoleRepository.GetAllUserRolesAsync();
            var response = userRoles.Select(ur => new UserRoleResponseDto
            {
                RolePermissionId = ur.RolePermissionId,
                UserId = ur.UserId,
                RoleId = ur.RoleId
            });
            return Ok(ApiResponse<IEnumerable<UserRoleResponseDto>>.SuccessResponse("User roles retrieved successfully", response));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> GetUserRoleById(int id)
        {
            var userRole = await _userRoleRepository.GetUserRoleByIdAsync(id);
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
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> CreateUserRole(CreateUserRoleDto createUserRoleDto)
        {
            var userRole = new UserRole
            {
                UserId = createUserRoleDto.UserId,
                RoleId = createUserRoleDto.RoleId
            };
            await _userRoleRepository.CreateUserRoleAsync(userRole);
            var response = new UserRoleResponseDto
            {
                RolePermissionId = userRole.RolePermissionId,
                UserId = userRole.UserId,
                RoleId = userRole.RoleId
            };

            return CreatedAtAction("GetUserRoleById", new { id = response.RolePermissionId }, ApiResponse<UserRoleResponseDto>.SuccessResponse("User role created successfully", response));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserRoleResponseDto>>> UpdateUserRole(int id, UpdateUserRoleDto updateUserRoleDto)
        {
            var userRole = await _userRoleRepository.GetUserRoleByIdAsync(id);
            if (userRole == null)
            {
                return NotFound(ApiResponse<UserRoleResponseDto>.ErrorResponse($"UserRole with {id} not found"));
            }
            userRole.UserId = updateUserRoleDto.UserId; userRole.RoleId = updateUserRoleDto.RoleId; await _userRoleRepository.UpdateUserRoleAsync(userRole);
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
            var deleted = await _userRoleRepository.DeleteUserRoleAsync(id);
            if (!deleted)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"UserRole with {id} not found"));
            }
            return Ok(ApiResponse<object>.SuccessResponse("User role deleted successfully", null!));
        }
    }
}