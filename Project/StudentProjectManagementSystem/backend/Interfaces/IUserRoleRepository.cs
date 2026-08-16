using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<IEnumerable<UserRole>> GetAllUserRolesAsync();
        Task<UserRole?> GetUserRoleByIdAsync(int id);
        Task<UserRole> CreateUserRoleAsync(UserRole userRole);
        Task<UserRole?> UpdateUserRoleAsync(UserRole userRole);
        Task<bool> DeleteUserRoleAsync(int id);
    }
}