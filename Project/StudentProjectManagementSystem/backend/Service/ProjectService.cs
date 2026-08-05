using StudentProjectManagementSystem.DTOs.Project;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Service
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;

        public ProjectService(IProjectRepository projectRepository, IUserRepository userRepository)
        {
            _projectRepository = projectRepository;
            _userRepository = userRepository;
        }

        public async Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                ProjectTitle = createProjectDto.ProjectTitle,
                StatusName = createProjectDto.StatusName
            };
            await _projectRepository.CreateProjectAsync(project);
            return new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectTitle = project.ProjectTitle,
                StatusName = project.StatusName
            };
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _projectRepository.GetProjectByIdAsync(id);
            if (project == null)
            {
                return false;
            }

            await _projectRepository.DeleteProjectAsync(project);
            return true;
        }

        public async Task<IEnumerable<ProjectResponseDto>> GetAllProjectsAsync()
        {
            var projects = await _projectRepository.GetAllProjectsAsync();
            return projects.Select(p => new ProjectResponseDto
            {
                ProjectId = p.ProjectId,
                ProjectTitle = p.ProjectTitle,
                StatusName = p.StatusName
            });
        }

        public async Task<ProjectResponseDto?> GetProjectByIdAsync(int id)
        {
            var project = await _projectRepository.GetProjectByIdAsync(id);

            if (project == null)
                return null;

            return new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectTitle = project.ProjectTitle,
                StatusName = project.StatusName
            };
        }

        public async Task<ProjectResponseDto?> UpdateProjectAsync(int id, UpdateProjectDto updateProjectDto)
        {
            var project = await _projectRepository.GetProjectByIdAsync(id);
            if (project == null)
                return null;
            project.ProjectTitle = updateProjectDto.ProjectTitle;
            await _projectRepository.UpdateProjectAsync(project);
            return new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectTitle = project.ProjectTitle,
                StatusName = project.StatusName
            };
        }
    }
}