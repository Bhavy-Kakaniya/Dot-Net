using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Repositories
{
    public class StatusRepository : IStatusRepository
    {
        private readonly ApplicationDbContext _context;

        public StatusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectTaskStatus>> GetAllStatusesAsync()
        {
            return await _context.TaskStatuses.ToListAsync();
        }

        public async Task<ProjectTaskStatus?> GetStatusByIdAsync(int id)
        {
            return await _context.TaskStatuses
                .FirstOrDefaultAsync(s => s.TaskStatusId == id);
        }

        public async Task<ProjectTaskStatus> CreateStatusAsync(ProjectTaskStatus status)
        {
            _context.TaskStatuses.Add(status);
            await _context.SaveChangesAsync();
            return status;
        }

        public async Task<ProjectTaskStatus?> UpdateStatusAsync(ProjectTaskStatus status)
        {
            _context.TaskStatuses.Update(status);
            await _context.SaveChangesAsync();
            return status;
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            var status = await _context.TaskStatuses.FindAsync(id);

            if (status == null)
                return false;

            _context.TaskStatuses.Remove(status);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}