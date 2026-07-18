using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IProjectTaskRepository
    {
        Task<IEnumerable<ProjectTask>> GetAllProjectTasksAsync();

        Task<ProjectTask?> GetProjectTaskByIdAsync(int id);

        Task<ProjectTask> CreateProjectTaskAsync(ProjectTask projectTask);

        Task<ProjectTask?> UpdateProjectTaskAsync(ProjectTask projectTask);

        Task<bool> DeleteProjectTaskAsync(int id);
    }
}