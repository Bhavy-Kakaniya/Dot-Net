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
            if (!await _userRepository.UserExistsAsync(createProjectDto.CreatedByUserId))
            {
                throw new InvalidOperationException("Created By User does not exist");
            }

            var project = new Project
            {
                Title = createProjectDto.Title,
                Description = createProjectDto.Description,
                Technology = createProjectDto.Technology,
                StartDate = createProjectDto.StartDate,
                EndDate = createProjectDto.EndDate,
                CreatedByUserId = createProjectDto.CreatedByUserId
            };

            await _projectRepository.CreateProjectAsync(project);

            return new ProjectResponseDto
            {
                CreatedByUserId = project.CreatedByUserId,
                Description = project.Description,
                EndDate = project.EndDate,
                ProjectId = project.ProjectId,
                StartDate = project.StartDate,
                Technology = project.Technology,
                Title = project.Title
            };
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ProjectResponseDto>> GetAllProjectsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ProjectResponseDto?> GetProjectByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateProjectAsync(int id, UpdateProjectDto updateProjectDto)
        {
            throw new NotImplementedException();
        }
    }
}