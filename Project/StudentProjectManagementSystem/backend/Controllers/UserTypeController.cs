using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.UserType;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
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
            var userTypes = await _context.UserTypes.Select(ut => new UserTypeResponseDto
            {
                UserTypeId = ut.UserTypeId,
                UserTypeName = ut.UserTypeName,
                Description = ut.Description
            }).ToListAsync();

            return Ok(ApiResponse<IEnumerable<UserTypeResponseDto>>.SuccessResponse("User types retrieved successfully", userTypes));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> GetUserTypeById(int id)
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

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> CreateUserType(CreateUserTypeDto dto)
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

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> UpdateUserType(int id, UpdateUserTypeDto dto)
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

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUserType(int id)
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
    }
}