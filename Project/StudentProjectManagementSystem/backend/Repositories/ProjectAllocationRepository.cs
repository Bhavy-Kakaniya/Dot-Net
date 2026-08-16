using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Repositories
{
    public class ProjectAllocationRepository : IProjectAllocationRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectAllocationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectAllocation>> GetAllProjectAllocationsAsync()
        {
            return await _context.ProjectAllocations
                .Include(pa => pa.Project)
                .Include(pa => pa.Student)
                .Include(pa => pa.Faculty)
                .ToListAsync();
        }

        public async Task<ProjectAllocation?> GetProjectAllocationByIdAsync(int id)
        {
            return await _context.ProjectAllocations
                .Include(pa => pa.Project)
                .Include(pa => pa.Student)
                .Include(pa => pa.Faculty)
                .FirstOrDefaultAsync(pa => pa.ProjectAllocationId == id);
        }

        public async Task<ProjectAllocation> CreateProjectAllocationAsync(
            ProjectAllocation projectAllocation)
        {
            _context.ProjectAllocations.Add(projectAllocation);
            await _context.SaveChangesAsync();
            return projectAllocation;
        }

        public async Task<ProjectAllocation?> UpdateProjectAllocationAsync(
            ProjectAllocation projectAllocation)
        {
            _context.ProjectAllocations.Update(projectAllocation);
            await _context.SaveChangesAsync();
            return projectAllocation;
        }

        public async Task<bool> DeleteProjectAllocationAsync(int id)
        {
            var projectAllocation =
                await _context.ProjectAllocations.FindAsync(id);

            if (projectAllocation == null)
                return false;

            _context.ProjectAllocations.Remove(projectAllocation);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}