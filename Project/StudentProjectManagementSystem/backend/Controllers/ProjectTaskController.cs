using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.ProjectTask;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTaskController : ControllerBase
    {
        private readonly IProjectTaskService _projectTaskService;

        public ProjectTaskController(IProjectTaskService projectTaskService)
        {
            _projectTaskService = projectTaskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTaskResponseDto>>> GetAllProjectTasks()
        {
            var projectTasks = await _projectTaskService.GetAllProjectTasksAsync();
            return Ok(projectTasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTaskResponseDto>> GetProjectTaskById(int id)
        {
            var projectTask = await _projectTaskService.GetProjectTaskByIdAsync(id);
            if (projectTask == null)
                return NotFound();

            return Ok(projectTask);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectTaskResponseDto>> CreateProjectTask(CreateProjectTaskDto createProjectTaskDto)
        {
            try
            {
                var projectTask = await _projectTaskService.CreateProjectTaskAsync(createProjectTaskDto);
                return CreatedAtAction(nameof(GetProjectTaskById), new { id = projectTask.ProjectTaskId }, projectTask);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectTaskResponseDto>> UpdateProjectTask(int id, UpdateProjectTaskDto updateProjectTaskDto)
        {
            try
            {
                var projectTask = await _projectTaskService.UpdateProjectTaskAsync(id, updateProjectTaskDto);
                if (projectTask == null)
                    return NotFound();

                return Ok(projectTask);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var deleted = await _projectTaskService.DeleteProjectTaskAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}