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

        public async Task<IEnumerable<Status>> GetAllStatusesAsync()
        {
            return await _context.Statuses.ToListAsync();
        }

        public async Task<Status?> GetStatusByIdAsync(int id)
        {
            return await _context.Statuses.FirstOrDefaultAsync(s => s.StatusId == id);
        }

        public async Task<Status> CreateStatusAsync(Status status)
        {
            _context.Statuses.Add(status);
            await _context.SaveChangesAsync();
            return status;
        }

        public async Task<Status?> UpdateStatusAsync(Status status)
        {
            _context.Statuses.Update(status);
            await _context.SaveChangesAsync();
            return status;
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            var status = await _context.Statuses.FindAsync(id);
            if (status == null)
                return false;

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}