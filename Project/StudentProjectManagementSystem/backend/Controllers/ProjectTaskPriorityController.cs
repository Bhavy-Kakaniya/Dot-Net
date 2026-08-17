using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.Models;
namespace StudentProjectManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectTaskPriorityController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectTaskPriorityController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectTaskPriority>>>> GetAll()
    {
        var priorities = await _context.TaskPriorities.ToListAsync();
        return Ok(ApiResponse<IEnumerable<ProjectTaskPriority>>.SuccessResponse("Task priorities retrieved successfully", priorities));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> GetById(int id)
    {
        var priority = await _context.TaskPriorities.FindAsync(id);
        if (priority == null)
        {
            return NotFound(ApiResponse<ProjectTaskPriority>.ErrorResponse($"Task priority with ID {id} not found"));
        }
        return Ok(ApiResponse<ProjectTaskPriority>.SuccessResponse("Task priority retrieved successfully", priority));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> Create(ProjectTaskPriority priority)
    {
        _context.TaskPriorities.Add(priority);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetById", new { id = priority.TaskPriorityId }, ApiResponse<ProjectTaskPriority>.SuccessResponse("Task priority created successfully", priority));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> Update(int id, ProjectTaskPriority priority)
    {
        var existing = await _context.TaskPriorities.FindAsync(id);
        if (existing == null)
        {
            return NotFound(ApiResponse<ProjectTaskPriority>.ErrorResponse($"Task priority with ID {id} not found"));
        }
        existing.TaskPriorityName = priority.TaskPriorityName;
        existing.TaskPriorityCssClass = priority.TaskPriorityCssClass;
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<ProjectTaskPriority>.SuccessResponse("Task priority updated successfully", existing));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var priority = await _context.TaskPriorities.FindAsync(id);
        if (priority == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Task priority with ID {id} not found"));
        }

        _context.TaskPriorities.Remove(priority);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse("Task priority deleted successfully", null!));
    }
}