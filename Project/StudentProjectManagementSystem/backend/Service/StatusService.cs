using StudentProjectManagementSystem.DTOs.Status;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Service
{
    public class StatusService : IStatusService
    {
        private readonly IStatusRepository _statusRepository;

        public StatusService(IStatusRepository statusRepository)
        {
            _statusRepository = statusRepository;
        }

        public async Task<IEnumerable<StatusResponseDto>> GetAllStatusesAsync()
        {
            var statuses = await _statusRepository.GetAllStatusesAsync();

            return statuses.Select(s => new StatusResponseDto
            {
                TaskStatusId = s.TaskStatusId,
                StatusName = s.StatusName
            });
        }

        public async Task<StatusResponseDto?> GetStatusByIdAsync(int id)
        {
            var status = await _statusRepository.GetStatusByIdAsync(id);

            if (status == null)
                return null;

            return new StatusResponseDto
            {
                TaskStatusId = status.TaskStatusId,
                StatusName = status.StatusName
            };
        }

        public async Task<StatusResponseDto> CreateStatusAsync(CreateStatusDto createStatusDto)
        {
            var status = new ProjectTaskStatus
            {
                StatusName = createStatusDto.StatusName
            };

            await _statusRepository.CreateStatusAsync(status);

            return new StatusResponseDto
            {
                TaskStatusId = status.TaskStatusId,
                StatusName = status.StatusName
            };
        }

        public async Task<StatusResponseDto?> UpdateStatusAsync(int id, UpdateStatusDto updateStatusDto)
        {
            var status = await _statusRepository.GetStatusByIdAsync(id);

            if (status == null)
                return null;

            status.StatusName = updateStatusDto.StatusName;

            await _statusRepository.UpdateStatusAsync(status);

            return new StatusResponseDto
            {
                TaskStatusId = status.TaskStatusId,
                StatusName = status.StatusName
            };
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            return await _statusRepository.DeleteStatusAsync(id);
        }
    }
}