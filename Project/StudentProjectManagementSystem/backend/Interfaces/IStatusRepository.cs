using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IStatusRepository
    {
        Task<IEnumerable<ProjectTaskStatus>> GetAllStatusesAsync();
        Task<ProjectTaskStatus?> GetStatusByIdAsync(int id);
        Task<ProjectTaskStatus> CreateStatusAsync(ProjectTaskStatus status);
        Task<ProjectTaskStatus?> UpdateStatusAsync(ProjectTaskStatus status);
        Task<bool> DeleteStatusAsync(int id);
    }
}