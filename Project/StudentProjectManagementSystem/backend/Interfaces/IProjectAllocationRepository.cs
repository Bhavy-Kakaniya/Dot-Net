using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IProjectAllocationRepository
    {
        Task<IEnumerable<ProjectAllocation>> GetAllProjectAllocationsAsync();
        Task<ProjectAllocation?> GetProjectAllocationByIdAsync(int id);
        Task<ProjectAllocation> CreateProjectAllocationAsync(ProjectAllocation projectAllocation);
        Task<ProjectAllocation?> UpdateProjectAllocationAsync(ProjectAllocation projectAllocation);
        Task<bool> DeleteProjectAllocationAsync(int id);
    }
}