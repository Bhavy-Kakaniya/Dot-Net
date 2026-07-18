using StudentProjectManagementSystem.DTOs.Project;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectResponseDto>> GetAllProjectsAsync();
        Task<ProjectResponseDto?> GetProjectByIdAsync(int id);
        Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto updateProjectDto);
        Task<ProjectResponseDto> UpdateProjectAsync(int id, UpdateProjectDto updateProjectDto);
        Task<bool> DeleteProjectAsync(int id);
    }
}