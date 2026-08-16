using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.ProjectAllocation;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectAllocationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectAllocationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectAllocationResponseDto>>>> GetAll()
    {
        var allocations = await _context.ProjectAllocations.ToListAsync();

        var response = allocations.Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<ProjectAllocationResponseDto>>.SuccessResponse("Project allocations retrieved successfully", response));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectAllocationResponseDto>>> GetById(int id)
    {
        var allocation = await _context.ProjectAllocations.FindAsync(id);
        if (allocation == null)
        {
            return NotFound(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse($"Project allocation with ID {id} not found"));
        }
        return Ok(ApiResponse<ProjectAllocationResponseDto>.SuccessResponse("Project allocation retrieved successfully", MapToDto(allocation)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectAllocationResponseDto>>> Create(
        CreateProjectAllocationDto dto)
    {
        if (!await _context.Projects.AnyAsync(x => x.ProjectId == dto.ProjectId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Project does not exist."));
        }
        if (!await _context.Users.AnyAsync(x => x.UserId == dto.StudentId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Student does not exist."));
        }
        if (!await _context.Users.AnyAsync(x => x.UserId == dto.FacultyId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Faculty does not exist."));
        }

        var allocation = new ProjectAllocation
        {
            ProjectId = dto.ProjectId,
            StudentId = dto.StudentId,
            FacultyId = dto.FacultyId,
            AssignedDate = DateTime.Now,
            ProjectStartDate = dto.ProjectStartDate,
            ProjectEndDate = dto.ProjectEndDate,
            TotalTasksGiven = 0,
            TotalCompletedTasks = 0,
            ProgressPercentage = 0,
            OverallGrade = dto.OverallGrade
        };

        _context.ProjectAllocations.Add(allocation);
        await _context.SaveChangesAsync();

        var response = MapToDto(allocation);

        return CreatedAtAction(
            nameof(GetById),
            new { id = allocation.ProjectAllocationId },
            ApiResponse<ProjectAllocationResponseDto>.SuccessResponse(
                "Project allocation created successfully",
                response
            )
        );
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectAllocationResponseDto>>> Update(
        int id,
        UpdateProjectAllocationDto dto)
    {
        var allocation = await _context.ProjectAllocations.FindAsync(id);
        if (allocation == null)
        {
            return NotFound(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse($"Project allocation with ID {id} not found"));
        }
        if (!await _context.Projects.AnyAsync(x => x.ProjectId == dto.ProjectId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Project does not exist."));
        }
        if (!await _context.Users.AnyAsync(x => x.UserId == dto.StudentId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Student does not exist."));
        }
        if (!await _context.Users.AnyAsync(x => x.UserId == dto.FacultyId))
        {
            return BadRequest(ApiResponse<ProjectAllocationResponseDto>.ErrorResponse("Faculty does not exist."));
        }
        allocation.ProjectId = dto.ProjectId;
        allocation.StudentId = dto.StudentId;
        allocation.FacultyId = dto.FacultyId;
        allocation.ProjectStartDate = dto.ProjectStartDate;
        allocation.ProjectEndDate = dto.ProjectEndDate;
        allocation.OverallGrade = dto.OverallGrade;

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<ProjectAllocationResponseDto>.SuccessResponse("Project allocation updated successfully", MapToDto(allocation)));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var allocation = await _context.ProjectAllocations.FindAsync(id);
        if (allocation == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Project allocation with ID {id} not found"));
        }

        _context.ProjectAllocations.Remove(allocation);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<object>.SuccessResponse("Project allocation deleted successfully", null!));
    }

    private static ProjectAllocationResponseDto MapToDto(
        ProjectAllocation allocation)
    {
        return new ProjectAllocationResponseDto
        {
            ProjectAllocationId = allocation.ProjectAllocationId,
            ProjectId = allocation.ProjectId,
            StudentId = allocation.StudentId,
            FacultyId = allocation.FacultyId,
            AssignedDate = allocation.AssignedDate,
            ProjectStartDate = allocation.ProjectStartDate,
            ProjectEndDate = allocation.ProjectEndDate,
            TotalTasksGiven = allocation.TotalTasksGiven,
            TotalCompletedTasks = allocation.TotalCompletedTasks,
            ProgressPercentage = allocation.ProgressPercentage,
            OverallGrade = allocation.OverallGrade
        };
    }
}