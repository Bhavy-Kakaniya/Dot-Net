using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.ProjectTask;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Service
{
    public class ProjectTaskService : IProjectTaskService
    {
        private readonly IProjectTaskRepository _projectTaskRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ApplicationDbContext _context;

        public ProjectTaskService(IProjectTaskRepository projectTaskRepository, IProjectRepository projectRepository, ApplicationDbContext context)
        {
            _projectTaskRepository = projectTaskRepository;
            _projectRepository = projectRepository;
            _context = context;
        }

        public async Task<IEnumerable<ProjectTaskResponseDto>> GetAllProjectTasksAsync()
        {
            var projectTasks = await _projectTaskRepository.GetAllProjectTasksAsync();
            return projectTasks.Select(pt => new ProjectTaskResponseDto
            {
                ProjectTaskId = pt.ProjectTaskId,
                ProjectId = pt.ProjectId,
                Title = pt.Title,
                Description = pt.Description,
                DueDate = pt.DueDate,
                StatusId = pt.StatusId,
                PriorityId = pt.PriorityId
            });
        }

        public async Task<ProjectTaskResponseDto?> GetProjectTaskByIdAsync(int id)
        {
            var projectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
            if (projectTask == null)
                return null;

            return new ProjectTaskResponseDto
            {
                ProjectTaskId = projectTask.ProjectTaskId,
                ProjectId = projectTask.ProjectId,
                Title = projectTask.Title,
                Description = projectTask.Description,
                DueDate = projectTask.DueDate,
                StatusId = projectTask.StatusId,
                PriorityId = projectTask.PriorityId
            };
        }

        public async Task<ProjectTaskResponseDto> CreateProjectTaskAsync(CreateProjectTaskDto dto)
        {
            if (await _projectRepository.GetProjectByIdAsync(dto.ProjectId) == null)
                throw new InvalidOperationException("Project does not exist");

            if (!await _context.Statuses.AnyAsync(s => s.StatusId == dto.StatusId))
                throw new InvalidOperationException("Status does not exist");

            if (!await _context.Priorities.AnyAsync(p => p.PriorityId == dto.PriorityId))
                throw new InvalidOperationException("Priority does not exist");

            var projectTask = new ProjectTask
            {
                ProjectId = dto.ProjectId,
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                StatusId = dto.StatusId,
                PriorityId = dto.PriorityId
            };

            await _projectTaskRepository.CreateProjectTaskAsync(projectTask);

            return new ProjectTaskResponseDto
            {
                ProjectTaskId = projectTask.ProjectTaskId,
                ProjectId = projectTask.ProjectId,
                Title = projectTask.Title,
                Description = projectTask.Description,
                DueDate = projectTask.DueDate,
                StatusId = projectTask.StatusId,
                PriorityId = projectTask.PriorityId
            };
        }

        public async Task<ProjectTaskResponseDto?> UpdateProjectTaskAsync(int id, UpdateProjectTaskDto dto)
        {
            var projectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);

            if (projectTask == null)
                return null;

            if (await _projectRepository.GetProjectByIdAsync(dto.ProjectId) == null)
                throw new InvalidOperationException("Project does not exist");

            if (!await _context.Statuses.AnyAsync(s => s.StatusId == dto.StatusId))
                throw new InvalidOperationException("Status does not exist");

            if (!await _context.Priorities.AnyAsync(p => p.PriorityId == dto.PriorityId))
                throw new InvalidOperationException("Priority does not exist");

            projectTask.ProjectId = dto.ProjectId;
            projectTask.Title = dto.Title;
            projectTask.Description = dto.Description;
            projectTask.DueDate = dto.DueDate;
            projectTask.StatusId = dto.StatusId;
            projectTask.PriorityId = dto.PriorityId;

            await _projectTaskRepository.UpdateProjectTaskAsync(projectTask);

            return new ProjectTaskResponseDto
            {
                ProjectTaskId = projectTask.ProjectTaskId,
                ProjectId = projectTask.ProjectId,
                Title = projectTask.Title,
                Description = projectTask.Description,
                DueDate = projectTask.DueDate,
                StatusId = projectTask.StatusId,
                PriorityId = projectTask.PriorityId
            };
        }

        public async Task<bool> DeleteProjectTaskAsync(int id)
        {
            var projectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
            if (projectTask == null)
                return false;

            return await _projectTaskRepository.DeleteProjectTaskAsync(id);
        }
    }
}