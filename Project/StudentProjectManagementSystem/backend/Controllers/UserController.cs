using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.user;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

// Repository: Task<IEnumerable<User>>
// Service: Task<IEnumerable<UserResponseDto>>
// Controller: Task<ActionResult<IEnumerable<UserResponseDto>>>

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            // ActionResult allows to return different http response like ok notfound
            // IEnumerable is used for iterating over the user response dto which is data transfer object
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = $"user with {id} not found" });
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto createUserDto)
        {
            try
            {
                var createdUser = await _userService.CreateUserAsync(createUserDto);

                return CreatedAtAction(
                    nameof(GetUserById),
                    new { id = createdUser.UserId },
                    createdUser
                );
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var updated = await _userService.UpdateUserAsync(id, updateUserDto);
            if (!updated)
            {
                return NotFound(new { message = $"user with {id} not found" });
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"user with {id} not found" });
            }
            return NoContent();
        }
    }
}