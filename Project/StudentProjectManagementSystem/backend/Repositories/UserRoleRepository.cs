using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.Interfaces;
using StudentProjectManagementSystem.Models;

namespace StudentProjectManagementSystem.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserRole>> GetAllUserRolesAsync()
        {
            return await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .ToListAsync();
        }

        public async Task<UserRole?> GetUserRoleByIdAsync(int id)
        {
            return await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.RolePermissionId == id);
        }

        public async Task<UserRole> CreateUserRoleAsync(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();
            return userRole;
        }

        public async Task<UserRole?> UpdateUserRoleAsync(UserRole userRole)
        {
            _context.UserRoles.Update(userRole);
            await _context.SaveChangesAsync();
            return userRole;
        }

        public async Task<bool> DeleteUserRoleAsync(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);

            if (userRole == null)
                return false;

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}