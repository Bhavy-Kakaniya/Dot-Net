using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.UserType;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserTypeResponseDto>>>> GetAllUserTypes()
        {
            try
            {
                var userTypes = await _context.UserTypes.Select(ut => new UserTypeResponseDto
                {
                    UserTypeId = ut.UserTypeId,
                    UserTypeName = ut.UserTypeName,
                    Description = ut.Description
                }).ToListAsync();

                return Ok(ApiResponse<IEnumerable<UserTypeResponseDto>>.SuccessResponse("User types retrieved successfully", userTypes));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<UserTypeResponseDto>>.ErrorResponse($"An error occurred while retrieving user types: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> GetUserTypeById(int id)
        {
            try
            {
                var userType = await _context.UserTypes.FindAsync(id);
                if (userType == null)
                {
                    return NotFound(ApiResponse<UserTypeResponseDto>.ErrorResponse($"UserType with {id} not found"));
                }

                var response = new UserTypeResponseDto
                {
                    UserTypeId = userType.UserTypeId,
                    UserTypeName = userType.UserTypeName,
                    Description = userType.Description
                };
                return Ok(ApiResponse<UserTypeResponseDto>.SuccessResponse("User type retrieved successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserTypeResponseDto>.ErrorResponse($"An error occurred while retrieving user type: {ex.Message}"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> CreateUserType(CreateUserTypeDto dto)
        {
            try
            {
                var userType = new UserType
                {
                    UserTypeName = dto.UserTypeName,
                    Description = dto.Description
                };
                _context.UserTypes.Add(userType);
                await _context.SaveChangesAsync();

                var response = new UserTypeResponseDto
                {
                    UserTypeId = userType.UserTypeId,
                    UserTypeName = userType.UserTypeName,
                    Description = userType.Description
                };
                return CreatedAtAction(nameof(GetUserTypeById), new { id = userType.UserTypeId }, ApiResponse<UserTypeResponseDto>.SuccessResponse("User type created successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserTypeResponseDto>.ErrorResponse($"An error occurred while creating user type: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> UpdateUserType(int id, UpdateUserTypeDto dto)
        {
            try
            {
                var userType = await _context.UserTypes.FindAsync(id);
                if (userType == null)
                {
                    return NotFound(ApiResponse<UserTypeResponseDto>.ErrorResponse($"UserType with {id} not found"));
                }

                userType.UserTypeName = dto.UserTypeName;
                userType.Description = dto.Description;
                await _context.SaveChangesAsync();

                var response = new UserTypeResponseDto
                {
                    UserTypeId = userType.UserTypeId,
                    UserTypeName = userType.UserTypeName,
                    Description = userType.Description
                };
                return Ok(ApiResponse<UserTypeResponseDto>.SuccessResponse("User type updated successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserTypeResponseDto>.ErrorResponse($"An error occurred while updating user type: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUserType(int id)
        {
            try
            {
                var userType = await _context.UserTypes.FindAsync(id);
                if (userType == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse($"UserType with {id} not found"));
                }

                _context.UserTypes.Remove(userType);
                await _context.SaveChangesAsync();
                return Ok(ApiResponse<object>.SuccessResponse("User type deleted successfully", null!));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting user type: {ex.Message}"));
            }
        }
    }
}