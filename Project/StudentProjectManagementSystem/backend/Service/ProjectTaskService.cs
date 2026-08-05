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
        private readonly ApplicationDbContext _context;

        public ProjectTaskService(IProjectTaskRepository projectTaskRepository, IProjectRepository projectRepository, ApplicationDbContext context)
        {
            _projectTaskRepository = projectTaskRepository;
            _context = context;
        }

        public async Task<IEnumerable<ProjectTaskResponseDto>> GetAllProjectTasksAsync()
        {
            var tasks = await _projectTaskRepository.GetAllProjectTasksAsync();

            return tasks.Select(MapToDto);
        }

        public async Task<ProjectTaskResponseDto?> GetProjectTaskByIdAsync(int id)
        {
            var task = await _projectTaskRepository.GetProjectTaskByIdAsync(id);

            if (task == null)
                return null;

            return MapToDto(task);
        }

        // here
        public async Task<ProjectTaskResponseDto> CreateProjectTaskAsync(CreateProjectTaskDto dto)
        {
            if (!await _context.ProjectAllocations.AnyAsync(x => x.ProjectAllocationId == dto.ProjectAllocationId))
                throw new InvalidOperationException("Project Allocation does not exist");

            if (!await _context.Users.AnyAsync(x => x.UserId == dto.AssignedByFacultyId))
                throw new InvalidOperationException("Faculty does not exist");

            if (!await _context.Users.AnyAsync(x => x.UserId == dto.AssignedToStudentId))
                throw new InvalidOperationException("Student does not exist");
            
            if (!await _context.TaskStatuses.AnyAsync(x => x.TaskStatusId == dto.ProjectTaskStatusId))
                throw new InvalidOperationException("Task Status does not exist");
            
            if (!await _context.TaskPriorities.AnyAsync(x => x.ProjectTaskPriorityId == dto.ProjectTaskPriorityId))
                throw new InvalidOperationException("Task Priority does not exist");

            var task = new ProjectTask
            {
                ProjectAllocationId = dto.ProjectAllocationId,
                TaskTitle = dto.TaskTitle,
                TaskDescription = dto.TaskDescription,
                AssignedDate = dto.AssignedDate,
                DueDate = dto.DueDate,
                SubmissionDate = dto.SubmissionDate,
                AssignedByFacultyId = dto.AssignedByFacultyId,
                AssignedToStudentId = dto.AssignedToStudentId,
                TaskStatusId = dto.ProjectTaskStatusId,
                ProjectTaskPriorityId = dto.ProjectTaskPriorityId
            };

            await _projectTaskRepository.CreateProjectTaskAsync(task);

            return MapToDto(task);
        }
        // here
        public async Task<ProjectTaskResponseDto?> UpdateProjectTaskAsync(int id, UpdateProjectTaskDto dto)
        {
            var task = await _projectTaskRepository.GetProjectTaskByIdAsync(id);

            if (task == null)
                return null;

            task.ProjectAllocationId = dto.ProjectAllocationId;
            task.TaskTitle = dto.TaskTitle;
            task.TaskDescription = dto.TaskDescription;
            task.AssignedDate = dto.AssignedDate;
            task.DueDate = dto.DueDate;
            task.SubmissionDate = dto.SubmissionDate;
            task.AssignedByFacultyId = dto.AssignedByFacultyId;
            task.AssignedToStudentId = dto.AssignedToStudentId;
            task.TaskStatusId = dto.TaskStatusId;
            task.ProjectTaskPriorityId = dto.ProjectTaskPriorityId;

            await _projectTaskRepository.UpdateProjectTaskAsync(task);

            return MapToDto(task);
        }

        public async Task<bool> DeleteProjectTaskAsync(int id)
        {
            var projectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
            if (projectTask == null)
                return false;

            return await _projectTaskRepository.DeleteProjectTaskAsync(id);
        }



        private static ProjectTaskResponseDto MapToDto(ProjectTask task)
        {
            return new ProjectTaskResponseDto
            {
                TaskId = task.TaskId,
                ProjectAllocationId = task.ProjectAllocationId,
                TaskTitle = task.TaskTitle,
                TaskDescription = task.TaskDescription,
                AssignedDate = task.AssignedDate,
                DueDate = task.DueDate,
                SubmissionDate = task.SubmissionDate,
                AssignedByFacultyId = task.AssignedByFacultyId,
                AssignedToStudentId = task.AssignedToStudentId,
                TaskStatusId = task.TaskStatusId,
                ProjectTaskPriorityId = task.ProjectTaskPriorityId
            };
        }
    }
}