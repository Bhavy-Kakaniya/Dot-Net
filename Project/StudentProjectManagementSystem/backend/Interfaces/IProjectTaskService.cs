using StudentProjectManagementSystem.DTOs.ProjectTask;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IProjectTaskService
    {
        Task<IEnumerable<ProjectTaskResponseDto>> GetAllProjectTasksAsync();

        Task<ProjectTaskResponseDto?> GetProjectTaskByIdAsync(int id);

        Task<ProjectTaskResponseDto> CreateProjectTaskAsync(CreateProjectTaskDto createProjectTaskDto);

        Task<ProjectTaskResponseDto?> UpdateProjectTaskAsync(int id, UpdateProjectTaskDto updateProjectTaskDto);

        Task<bool> DeleteProjectTaskAsync(int id);
    }
}