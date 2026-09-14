using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Status;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatusController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<StatusResponseDto>>>> GetAllStatuses()
        {
            try
            {
                var statuses = await _context.TaskStatuses
                    .Select(s => new StatusResponseDto
                    {
                        TaskStatusId = s.TaskStatusId,
                        StatusName = s.TaskStatusName
                    }).ToListAsync();

                return Ok(ApiResponse<IEnumerable<StatusResponseDto>>.SuccessResponse("Statuses retrieved successfully", statuses));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<StatusResponseDto>>.ErrorResponse($"An error occurred while retrieving statuses: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<StatusResponseDto>>> GetStatusById(int id)
        {
            try
            {
                var status = await _context.TaskStatuses
                    .Where(s => s.TaskStatusId == id).Select(s => new StatusResponseDto
                    {
                        TaskStatusId = s.TaskStatusId,
                        StatusName = s.TaskStatusName
                    }).FirstOrDefaultAsync();

                if (status == null)
                {
                    return NotFound(ApiResponse<StatusResponseDto>.ErrorResponse($"Status with ID {id} not found"));
                }

                return Ok(ApiResponse<StatusResponseDto>.SuccessResponse("Status retrieved successfully", status));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<StatusResponseDto>.ErrorResponse($"An error occurred while retrieving status: {ex.Message}"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<StatusResponseDto>>> CreateStatus(CreateStatusDto dto)
        {
            try
            {
                var status = new ProjectTaskStatus
                {
                    TaskStatusName = dto.StatusName,
                    TaskStatusCssClass = ""
                };

                _context.TaskStatuses.Add(status);
                await _context.SaveChangesAsync();

                var response = new StatusResponseDto
                {
                    TaskStatusId = status.TaskStatusId,
                    StatusName = status.TaskStatusName
                };
                return CreatedAtAction("GetStatusById", new { id = status.TaskStatusId }, ApiResponse<StatusResponseDto>.SuccessResponse("Status created successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<StatusResponseDto>.ErrorResponse($"An error occurred while creating status: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<StatusResponseDto>>> UpdateStatus(int id, UpdateStatusDto dto)
        {
            try
            {
                var status = await _context.TaskStatuses.FindAsync(id);
                if (status == null)
                {
                    return NotFound(ApiResponse<StatusResponseDto>.ErrorResponse($"Status with ID {id} not found"));
                }

                status.TaskStatusName = dto.StatusName;
                await _context.SaveChangesAsync();

                var response = new StatusResponseDto
                {
                    TaskStatusId = status.TaskStatusId,
                    StatusName = status.TaskStatusName
                };

                return Ok(ApiResponse<StatusResponseDto>.SuccessResponse("Status updated successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<StatusResponseDto>.ErrorResponse($"An error occurred while updating status: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteStatus(int id)
        {
            try
            {
                var status = await _context.TaskStatuses.FindAsync(id);
                if (status == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse($"Status with ID {id} not found"));
                }

                _context.TaskStatuses.Remove(status);
                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResponse("Status deleted successfully", null!));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting status: {ex.Message}"));
            }
        }
    }
}