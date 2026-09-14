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
        try
        {
            var statuses = await _context.TaskStatuses.ToListAsync();
            return Ok(ApiResponse<IEnumerable<ProjectTaskStatus>>.SuccessResponse("Task statuses retrieved successfully", statuses));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProjectTaskStatus>>.ErrorResponse($"An error occurred while retrieving task statuses: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> GetById(int id)
    {
        try
        {
            var status = await _context.TaskStatuses.FindAsync(id);
            if (status == null)
            {
                return NotFound(ApiResponse<ProjectTaskStatus>.ErrorResponse($"Task status with ID {id} not found"));
            }
            return Ok(ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status retrieved successfully", status));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskStatus>.ErrorResponse($"An error occurred while retrieving task status: {ex.Message}"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> Create(ProjectTaskStatus status)
    {
        try
        {
            _context.TaskStatuses.Add(status);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetById", new { id = status.TaskStatusId }, ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status created successfully", status));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskStatus>.ErrorResponse($"An error occurred while creating task status: {ex.Message}"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectTaskStatus>>> Update(int id, ProjectTaskStatus status)
    {
        try
        {
            var existing = await _context.TaskStatuses.FindAsync(id);
            if (existing == null)
            {
                return NotFound(ApiResponse<ProjectTaskStatus>.ErrorResponse($"Task status with ID {id} not found"));
            }
            existing.TaskStatusName = status.TaskStatusName;
            existing.TaskStatusCssClass = status.TaskStatusCssClass;
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<ProjectTaskStatus>.SuccessResponse("Task status updated successfully", existing));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProjectTaskStatus>.ErrorResponse($"An error occurred while updating task status: {ex.Message}"));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var status = await _context.TaskStatuses.FindAsync(id);
            if (status == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"Task status with ID {id} not found"));
            }
            _context.TaskStatuses.Remove(status);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Task status deleted successfully", null!));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting task status: {ex.Message}"));
        }
    }
}