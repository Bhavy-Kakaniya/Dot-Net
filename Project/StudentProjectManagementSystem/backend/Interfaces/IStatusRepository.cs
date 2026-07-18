using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IStatusRepository
    {
        Task<IEnumerable<Status>> GetAllStatusesAsync();

        Task<Status?> GetStatusByIdAsync(int id);

        Task<Status> CreateStatusAsync(Status status);

        Task<Status?> UpdateStatusAsync(Status status);

        Task<bool> DeleteStatusAsync(int id);
    }
}