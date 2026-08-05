using System.ComponentModel.DataAnnotations;

namespace StudentProjectManagementSystem.DTOs.Status
{
    public class CreateStatusDto
    {
        public string StatusName { get; set; } = string.Empty;
    }
}