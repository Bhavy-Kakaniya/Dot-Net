using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.Project;
using StudentProjectManagementSystem.DTOs.user;
using StudentProjectManagementSystem.DTOs.User;
using StudentProjectManagementSystem.Interfaces;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetAllProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDto>> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectResponseDto>> CreateProject(CreateProjectDto createProjectDto)
        {
            var project = await _projectService.CreateProjectAsync(createProjectDto);

            return CreatedAtAction(
                nameof(GetProjectById),
                new { id = project.ProjectId },
                project);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectResponseDto>> UpdateProject(int id, UpdateProjectDto updateProjectDto)
        {
            var project = await _projectService.UpdateProjectAsync(id, updateProjectDto);
            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var deleted = await _projectService.DeleteProjectAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}