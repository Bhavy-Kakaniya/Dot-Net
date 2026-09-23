using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Project;

namespace StudentProjectManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Faculty,Student")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectResponseDto>>>> GetAllProjects(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;

                var projects = await _context.Projects
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new ProjectResponseDto
                    {
                        ProjectId = p.ProjectId,
                        ProjectTitle = p.ProjectTitle
                    }).ToListAsync();

                return Ok(ApiResponse<IEnumerable<ProjectResponseDto>>.SuccessResponse("Projects retrieved successfully", projects));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<ProjectResponseDto>>.ErrorResponse($"An error occurred while retrieving projects: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Faculty,Student")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> GetProjectById([FromRoute] int id)
        {
            try
            {
                var project = await _context.Projects
                    .Where(p => p.ProjectId == id)
                    .Select(p => new ProjectResponseDto
                    {
                        ProjectId = p.ProjectId,
                        ProjectTitle = p.ProjectTitle
                    }).FirstOrDefaultAsync();

                if (project == null)
                {
                    return NotFound(ApiResponse<ProjectResponseDto>.ErrorResponse($"Project with ID {id} not found"));
                }
                return Ok(ApiResponse<ProjectResponseDto>.SuccessResponse("Project retrieved successfully", project));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProjectResponseDto>.ErrorResponse($"An error occurred while retrieving project: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Faculty")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> CreateProject([FromBody] CreateProjectDto dto)
        {
            try
            {
                var project = new Models.Project
                {
                    ProjectTitle = dto.ProjectTitle
                };
                _context.Projects.Add(project);
                await _context.SaveChangesAsync();
                var response = new ProjectResponseDto
                {
                    ProjectId = project.ProjectId,
                    ProjectTitle = project.ProjectTitle
                };
                return CreatedAtAction("GetProjectById", new { id = project.ProjectId }, ApiResponse<ProjectResponseDto>.SuccessResponse("Project created successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProjectResponseDto>.ErrorResponse($"An error occurred while creating project: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Faculty")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> UpdateProject([FromRoute] int id, [FromBody] UpdateProjectDto dto)
        {
            try
            {
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
                if (project == null)
                {
                    return NotFound(ApiResponse<ProjectResponseDto>.ErrorResponse($"Project with ID {id} not found"));
                }
                project.ProjectTitle = dto.ProjectTitle;
                await _context.SaveChangesAsync();
                var response = new ProjectResponseDto
                {
                    ProjectId = project.ProjectId,
                    ProjectTitle = project.ProjectTitle
                };
                return Ok(ApiResponse<ProjectResponseDto>.SuccessResponse("Project updated successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProjectResponseDto>.ErrorResponse($"An error occurred while updating project: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteProject([FromRoute] int id)
        {
            try
            {
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);

                if (project == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse($"Project with ID {id} not found"));
                }

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
                return Ok(ApiResponse<object>.SuccessResponse("Project deleted successfully", null!));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"An error occurred while deleting project: {ex.Message}"));
            }
        }
    }
}