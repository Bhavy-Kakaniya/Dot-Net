using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.Status
{
    public class UpdateStatusDto
    {
        public string StatusName { get; set; } = string.Empty;
    }
}