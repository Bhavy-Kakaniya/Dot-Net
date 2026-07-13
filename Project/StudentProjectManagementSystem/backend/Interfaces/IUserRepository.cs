using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string Email);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task<bool> UserExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email);
        Task DeleteUserAsync(User user);
    }
}