using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;
using StudentProjectManagementSystem.DTOs.Project;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectResponseDto>>>> GetAllProjects()
        {
            var projects = await _context.Projects
                .Select(p => new ProjectResponseDto
                {
                    ProjectId = p.ProjectId,
                    ProjectTitle = p.ProjectTitle
                })
                .ToListAsync();

            return Ok(
                ApiResponse<IEnumerable<ProjectResponseDto>>.SuccessResponse(
                    "Projects retrieved successfully",
                    projects
                )
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> GetProjectById(int id)
        {
            var project = await _context.Projects
                .Where(p => p.ProjectId == id)
                .Select(p => new ProjectResponseDto
                {
                    ProjectId = p.ProjectId,
                    ProjectTitle = p.ProjectTitle
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound(
                    ApiResponse<ProjectResponseDto>.ErrorResponse(
                        $"Project with ID {id} not found"
                    )
                );
            }

            return Ok(
                ApiResponse<ProjectResponseDto>.SuccessResponse(
                    "Project retrieved successfully",
                    project
                )
            );
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> CreateProject(
            CreateProjectDto dto)
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

            return CreatedAtAction(
                nameof(GetProjectById),
                new { id = project.ProjectId },
                ApiResponse<ProjectResponseDto>.SuccessResponse(
                    "Project created successfully",
                    response
                )
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> UpdateProject(
            int id,
            UpdateProjectDto dto)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null)
            {
                return NotFound(
                    ApiResponse<ProjectResponseDto>.ErrorResponse(
                        $"Project with ID {id} not found"
                    )
                );
            }

            project.ProjectTitle = dto.ProjectTitle;

            await _context.SaveChangesAsync();

            var response = new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectTitle = project.ProjectTitle
            };

            return Ok(
                ApiResponse<ProjectResponseDto>.SuccessResponse(
                    "Project updated successfully",
                    response
                )
            );
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteProject(int id)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null)
            {
                return NotFound(
                    ApiResponse<object>.ErrorResponse(
                        $"Project with ID {id} not found"
                    )
                );
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(
                ApiResponse<object>.SuccessResponse(
                    "Project deleted successfully",
                    null!
                )
            );
        }
    }
}