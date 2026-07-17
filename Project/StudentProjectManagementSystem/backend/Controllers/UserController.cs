using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Interfaces;

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
        
    }
}