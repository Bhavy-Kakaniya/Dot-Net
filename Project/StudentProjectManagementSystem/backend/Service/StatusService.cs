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
                StatusId = s.StatusId,
                StatusName = s.StatusName,
                Description = s.Description
            });
        }

        public async Task<StatusResponseDto?> GetStatusByIdAsync(int id)
        {
            var status = await _statusRepository.GetStatusByIdAsync(id);
            if (status == null)
                return null;

            return new StatusResponseDto
            {
                StatusId = status.StatusId,
                StatusName = status.StatusName,
                Description = status.Description
            };
        }

        public async Task<StatusResponseDto> CreateStatusAsync(CreateStatusDto createStatusDto)
        {
            var status = new Status
            {
                StatusName = createStatusDto.StatusName,
                Description = createStatusDto.Description
            };
            await _statusRepository.CreateStatusAsync(status);
            return new StatusResponseDto
            {
                StatusId = status.StatusId,
                StatusName = status.StatusName,
                Description = status.Description
            };
        }

        public async Task<StatusResponseDto?> UpdateStatusAsync(int id, UpdateStatusDto updateStatusDto)
        {
            var status = await _statusRepository.GetStatusByIdAsync(id);

            if (status == null)
                return null;

            status.StatusName = updateStatusDto.StatusName;
            status.Description = updateStatusDto.Description;
            await _statusRepository.UpdateStatusAsync(status);
            return new StatusResponseDto
            {
                StatusId = status.StatusId,
                StatusName = status.StatusName,
                Description = status.Description
            };
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            var status = await _statusRepository.GetStatusByIdAsync(id);
            if (status == null)
                return false;

            return await _statusRepository.DeleteStatusAsync(id);
        }
    }
}