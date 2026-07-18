using Microsoft.AspNetCore.Mvc;
using StudentProjectManagementSystem.DTOs.Status;
using StudentProjectManagementSystem.Interfaces;

namespace StudentProjectManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatusResponseDto>>> GetAllStatuses()
        {
            var statuses = await _statusService.GetAllStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StatusResponseDto>> GetStatusById(int id)
        {
            var status = await _statusService.GetStatusByIdAsync(id);
            if (status == null)
                return NotFound();

            return Ok(status);
        }

        [HttpPost]
        public async Task<ActionResult<StatusResponseDto>> CreateStatus(CreateStatusDto createStatusDto)
        {
            var status = await _statusService.CreateStatusAsync(createStatusDto);
            return CreatedAtAction(
                nameof(GetStatusById),
                new { id = status.StatusId },
                status);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StatusResponseDto>> UpdateStatus(int id, UpdateStatusDto updateStatusDto)
        {
            var status = await _statusService.UpdateStatusAsync(id, updateStatusDto);
            if (status == null)
                return NotFound();

            return Ok(status);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var deleted = await _statusService.DeleteStatusAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}