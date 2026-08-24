using Demo.Data;
using Demo.DTOs;
using Demo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Demo.Controllers;

[ApiController]

public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email
            })
            .ToListAsync();

        return Ok(
            new ApiResponse<object>(
                true,
                "Users fetched successfully",
                users
            )
        );
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(
                new ApiResponse<object>(
                    false,
                    "User not found"
                )
            );
        }

        return Ok(
            new ApiResponse<object>(
                true,
                "User fetched successfully",
                user
            )
        );
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new ApiResponse<object>(false,"User not found"));
        }
        return Ok(
            new ApiResponse<object>(
                true,
                "User fetched successfully",
                user
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(UserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = dto.Password
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(
            new ApiResponse<User>(
                true,
                "User created successfully",
                user
            )
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, UserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(
                new ApiResponse<object>(
                    false,
                    "User not found"
                )
            );
        }

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.Password = dto.Password;

        await _context.SaveChangesAsync();
        return Ok(
            new ApiResponse<User>(
                true,
                "User updated successfully",
                user
            )
        );
    }

}