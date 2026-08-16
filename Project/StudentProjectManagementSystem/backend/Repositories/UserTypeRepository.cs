using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Repositories
{
    public class UserTypeRepository : IUserTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public UserTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserType>> GetAllUserTypesAsync()
        {
            return await _context.UserTypes.ToListAsync();
        }

        public async Task<UserType?> GetUserTypeByIdAsync(int id)
        {
            return await _context.UserTypes
                .FirstOrDefaultAsync(ut => ut.UserTypeId == id);
        }

        public async Task<UserType> CreateUserTypeAsync(UserType userType)
        {
            _context.UserTypes.Add(userType);
            await _context.SaveChangesAsync();
            return userType;
        }

        public async Task<UserType?> UpdateUserTypeAsync(UserType userType)
        {
            _context.UserTypes.Update(userType);
            await _context.SaveChangesAsync();
            return userType;
        }

        public async Task<bool> DeleteUserTypeAsync(int id)
        {
            var userType = await _context.UserTypes.FindAsync(id);

            if (userType == null)
                return false;

            _context.UserTypes.Remove(userType);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}