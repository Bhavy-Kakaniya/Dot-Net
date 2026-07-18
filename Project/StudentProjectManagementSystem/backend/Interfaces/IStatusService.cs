using StudentProjectManagementSystem.DTOs.Status;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IStatusService
    {
        Task<IEnumerable<StatusResponseDto>> GetAllStatusesAsync();

        Task<StatusResponseDto?> GetStatusByIdAsync(int id);

        Task<StatusResponseDto> CreateStatusAsync(CreateStatusDto createStatusDto);

        Task<StatusResponseDto?> UpdateStatusAsync(int id, UpdateStatusDto updateStatusDto);

        Task<bool> DeleteStatusAsync(int id);
    }
}