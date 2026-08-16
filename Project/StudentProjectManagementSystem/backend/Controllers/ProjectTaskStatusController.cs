using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectTaskStatusController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectTaskStatusController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectTaskStatus>>>> GetAll()
    {
        var statuses = await _context.TaskStatuses.ToListAsync();

        return Ok(ApiResponse<IEnumerable<ProjectTaskStatus>>.SuccessResponse("Task statuses retrieved successfully",statuses));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> GetById(int id)
    {
        var status = await _context.TaskStatuses.FindAsync(id);

        if (status == null)
        {
            return NotFound(ApiResponse<ProjectTaskStatus>.ErrorResponse($"Task status with ID {id} not found"));
        }

        return Ok(ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status retrieved successfully",status));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> Create(ProjectTaskStatus status)
    {
        _context.TaskStatuses.Add(status);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetById",new { id = status.TaskStatusId },ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status created successfully",status));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> Update(
        int id,
        ProjectTaskStatus status)
    {
        var existing = await _context.TaskStatuses.FindAsync(id);

        if (existing == null)
        {
            return NotFound(ApiResponse<ProjectTaskStatus>.ErrorResponse($"Task status with ID {id} not found"));
        }

        existing.TaskStatusName = status.TaskStatusName;
        existing.TaskStatusCssClass = status.TaskStatusCssClass;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status updated successfully",existing));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var status = await _context.TaskStatuses.FindAsync(id);

        if (status == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Task status with ID {id} not found"));
        }

        _context.TaskStatuses.Remove(status);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse("Task status deleted successfully",null!));
    }
}