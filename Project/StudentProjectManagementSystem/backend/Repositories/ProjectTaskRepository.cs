using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Repositories
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectTaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectTask>> GetAllProjectTasksAsync()
        {
            return await _context.ProjectTasks
                .Include(pt => pt.ProjectAllocation)
                .Include(pt => pt.ProjectTaskStatus)
                .Include(pt => pt.ProjectTaskPriority)
                .ToListAsync();
        }

        public async Task<ProjectTask?> GetProjectTaskByIdAsync(int id)
        {
            return await _context.ProjectTasks
                .Include(pt => pt.ProjectAllocation)
                .Include(pt => pt.ProjectTaskStatus)
                .Include(pt => pt.ProjectTaskPriority)
                .FirstOrDefaultAsync(pt => pt.TaskId == id);
        }

        public async Task<ProjectTask> CreateProjectTaskAsync(ProjectTask projectTask)
        {
            _context.ProjectTasks.Add(projectTask);
            await _context.SaveChangesAsync();

            return projectTask;
        }

        public async Task<ProjectTask?> UpdateProjectTaskAsync(ProjectTask projectTask)
        {
            _context.ProjectTasks.Update(projectTask);
            await _context.SaveChangesAsync();

            return projectTask;
        }

        public async Task<bool> DeleteProjectTaskAsync(int id)
        {
            var projectTask = await _context.ProjectTasks.FindAsync(id);

            if (projectTask == null)
                return false;

            _context.ProjectTasks.Remove(projectTask);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}