using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<Role?> GetRoleByIdAsync(int id);
        Task<Role> CreateRoleAsync(Role role);
        Task<Role?> UpdateRoleAsync(Role role);
        Task<bool> DeleteRoleAsync(int id);
    }
}