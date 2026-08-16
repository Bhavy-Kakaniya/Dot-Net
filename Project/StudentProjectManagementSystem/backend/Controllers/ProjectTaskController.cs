using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.ProjectTask;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectTaskResponseDto>>>> GetAllProjectTasks()
        {
            var tasks = await _context.ProjectTasks.ToListAsync();
            var response = tasks.Select(MapToDto);
            return Ok(ApiResponse<IEnumerable<ProjectTaskResponseDto>>.SuccessResponse("Project tasks retrieved successfully", response));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectTaskResponseDto>>> GetProjectTaskById(int id)
        {
            var task = await _context.ProjectTasks.FindAsync(id);

            if (task == null)
            { return NotFound(ApiResponse<ProjectTaskResponseDto>.ErrorResponse($"Project task with ID {id} not found")); }
            return Ok(ApiResponse<ProjectTaskResponseDto>.SuccessResponse("Project task retrieved successfully", MapToDto(task)));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProjectTaskResponseDto>>> CreateProjectTask(
            CreateProjectTaskDto dto)
        {
            if (!await _context.ProjectAllocations.AnyAsync(x => x.ProjectAllocationId == dto.ProjectAllocationId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Project Allocation does not exist."));
            }

            if (!await _context.TaskStatuses.AnyAsync(x => x.TaskStatusId == dto.TaskStatusId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Task Status does not exist."));
            }

            if (!await _context.TaskPriorities.AnyAsync(x => x.TaskPriorityId == dto.TaskPriorityId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Task Priority does not exist."));
            }

            var task = new ProjectTask
            {
                ProjectAllocationId = dto.ProjectAllocationId,
                TaskTitle = dto.TaskTitle,
                TaskDescription = dto.TaskDescription,
                TaskStatusId = dto.TaskStatusId,
                TaskPriorityId = dto.TaskPriorityId,
                AssignedScore = dto.AssignedScore,
                EarnedScore = dto.EarnedScore,
                ProgressPercentage = dto.ProgressPercentage,
                TaskAssignedDate = DateTime.Now,
                TaskStartDate = dto.TaskStartDate,
                TaskDueDate = dto.TaskDueDate,
                TaskCompletedDate = dto.TaskCompletedDate,
                NextFollowUpDate = dto.NextFollowUpDate,
                FacultyRemarks = dto.FacultyRemarks,
                StudentRemarks = dto.StudentRemarks
            };

            _context.ProjectTasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectTaskById",new { id = task.TaskId }, ApiResponse<ProjectTaskResponseDto>.SuccessResponse("Project task created successfully", MapToDto(task)));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectTaskResponseDto>>> UpdateProjectTask(int id,UpdateProjectTaskDto dto)
        {
            var task = await _context.ProjectTasks.FindAsync(id);

            if (task == null)
            {
                return NotFound(ApiResponse<ProjectTaskResponseDto>.ErrorResponse($"Project task with ID {id} not found"));
            }
            if (!await _context.ProjectAllocations
                .AnyAsync(x => x.ProjectAllocationId == dto.ProjectAllocationId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Project Allocation does not exist."));
            }

            if (!await _context.TaskStatuses.AnyAsync(x => x.TaskStatusId == dto.TaskStatusId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Task Status does not exist."));
            }

            if (!await _context.TaskPriorities
                .AnyAsync(x => x.TaskPriorityId == dto.TaskPriorityId))
            {
                return BadRequest(ApiResponse<ProjectTaskResponseDto>.ErrorResponse("Task Priority does not exist."));
            }

            task.ProjectAllocationId = dto.ProjectAllocationId;
            task.TaskTitle = dto.TaskTitle;
            task.TaskDescription = dto.TaskDescription;
            task.TaskStatusId = dto.TaskStatusId;
            task.TaskPriorityId = dto.TaskPriorityId;
            task.AssignedScore = dto.AssignedScore;
            task.EarnedScore = dto.EarnedScore;
            task.ProgressPercentage = dto.ProgressPercentage;
            task.TaskStartDate = dto.TaskStartDate;
            task.TaskDueDate = dto.TaskDueDate;
            task.TaskCompletedDate = dto.TaskCompletedDate;
            task.NextFollowUpDate = dto.NextFollowUpDate;
            task.FacultyRemarks = dto.FacultyRemarks;
            task.StudentRemarks = dto.StudentRemarks;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<ProjectTaskResponseDto>.SuccessResponse("Project task updated successfully", MapToDto(task)));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteProjectTask(int id)
        {
            var task = await _context.ProjectTasks.FindAsync(id);

            if (task == null)
            { return NotFound(ApiResponse<object>.ErrorResponse($"Project task with ID {id} not found")); }
            _context.ProjectTasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse("Project task deleted successfully", null!));
        }

        private static ProjectTaskResponseDto MapToDto(ProjectTask task)
        {
            return new ProjectTaskResponseDto
            {
                TaskId = task.TaskId,
                ProjectAllocationId = task.ProjectAllocationId,
                TaskTitle = task.TaskTitle,
                TaskDescription = task.TaskDescription,
                TaskStatusId = task.TaskStatusId,
                TaskPriorityId = task.TaskPriorityId,
                AssignedScore = task.AssignedScore,
                EarnedScore = task.EarnedScore,
                ProgressPercentage = Convert.ToDecimal(task.ProgressPercentage),
                TaskAssignedDate = task.TaskAssignedDate,
                TaskStartDate = task.TaskStartDate,
                TaskDueDate = task.TaskDueDate,
                TaskCompletedDate = task.TaskCompletedDate,
                NextFollowUpDate = task.NextFollowUpDate,
                FacultyRemarks = task.FacultyRemarks,
                StudentRemarks = task.StudentRemarks
            };
        }
    }
}