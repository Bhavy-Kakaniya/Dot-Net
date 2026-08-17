using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.UserType;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserTypeController : ControllerBase
    {
        private readonly IUserTypeRepository _userTypeRepository;

        public UserTypeController(IUserTypeRepository userTypeRepository)
        {
            _userTypeRepository = userTypeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserTypeResponseDto>>>> GetAllUserTypes()
        {
            var userTypes = await _userTypeRepository.GetAllUserTypesAsync();
            var response = userTypes.Select(ut => new UserTypeResponseDto
            {
                UserTypeId = ut.UserTypeId,
                UserTypeName = ut.UserTypeName,
                Description = ut.Description
            });
            return Ok(ApiResponse<IEnumerable<UserTypeResponseDto>>.SuccessResponse("User types retrieved successfully", response));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> GetUserTypeById(int id)
        {
            var userType = await _userTypeRepository.GetUserTypeByIdAsync(id);
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
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> CreateUserType(CreateUserTypeDto createUserTypeDto)
        {
            var userType = new UserType
            {
                UserTypeName = createUserTypeDto.UserTypeName,
                Description = createUserTypeDto.Description
            };
            await _userTypeRepository.CreateUserTypeAsync(userType);
            var response = new UserTypeResponseDto
            {
                UserTypeId = userType.UserTypeId,
                UserTypeName = userType.UserTypeName,
                Description = userType.Description
            };

            return CreatedAtAction("GetUserTypeById", new { id = userType.UserTypeId }, ApiResponse<UserTypeResponseDto>.SuccessResponse("User type created successfully", response));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserTypeResponseDto>>> UpdateUserType(int id, UpdateUserTypeDto updateUserTypeDto)
        {
            var userType = await _userTypeRepository.GetUserTypeByIdAsync(id);
            if (userType == null)
            {
                return NotFound(ApiResponse<UserTypeResponseDto>.ErrorResponse($"UserType with {id} not found"));
            }

            userType.UserTypeName = updateUserTypeDto.UserTypeName;
            userType.Description = updateUserTypeDto.Description;

            await _userTypeRepository.UpdateUserTypeAsync(userType);

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
            var deleted = await _userTypeRepository.DeleteUserTypeAsync(id);
            if (!deleted)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"UserType with {id} not found"));
            }
            return Ok(ApiResponse<object>.SuccessResponse("User type deleted successfully", null!));
        }
    }
}