using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Interfaces
{
    public interface IUserTypeRepository
    {
        Task<IEnumerable<UserType>> GetAllUserTypesAsync();
        Task<UserType?> GetUserTypeByIdAsync(int id);
        Task<UserType> CreateUserTypeAsync(UserType userType);
        Task<UserType?> UpdateUserTypeAsync(UserType userType);
        Task<bool> DeleteUserTypeAsync(int id);
    }
}