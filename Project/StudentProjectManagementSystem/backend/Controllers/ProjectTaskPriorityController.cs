using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers;

[Authorize]
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
        try
        {
            var priorities = await _context.TaskPriorities.ToListAsync();
            return Ok(ApiResponse<IEnumerable<ProjectTaskPriority>>.SuccessResponse("Task priorities retrieved successfully", priorities));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProjectTaskPriority>>.ErrorResponse($"An error occurred while retrieving task priorities: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> GetById(int id)
    {
        try
        {
            var priority = await _context.TaskPriorities.FindAsync(id);
            if (priority == null)
            {
                return NotFound(ApiResponse<ProjectTaskPriority>.ErrorResponse($"Task priority with ID {id} not found"));
            }
            return Ok(ApiResponse<ProjectTaskPriority>.SuccessResponse("Task priority retrieved successfully", priority));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskPriority>.ErrorResponse($"An error occurred while retrieving task priority: {ex.Message}"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> Create(ProjectTaskPriority priority)
    {
        try
        {
            _context.TaskPriorities.Add(priority);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetById", new { id = priority.TaskPriorityId }, ApiResponse<ProjectTaskPriority>.SuccessResponse("Task priority created successfully", priority));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskPriority>.ErrorResponse($"An error occurred while creating task priority: {ex.Message}"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskPriority>>> Update(int id, ProjectTaskPriority priority)
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskPriority>.ErrorResponse($"An error occurred while updating task priority: {ex.Message}"));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting task priority: {ex.Message}"));
        }
    }
}