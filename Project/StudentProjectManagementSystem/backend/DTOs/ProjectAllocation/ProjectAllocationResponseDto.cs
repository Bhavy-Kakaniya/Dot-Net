namespace StudentProjectManagementSystem.DTOs.ProjectAllocation
{
    public class ProjectAllocationResponseDto
    {
        public int ProjectAllocationId { get; set; }

        public int ProjectId { get; set; }

        public int StudentId { get; set; }

        public int FacultyId { get; set; }

        public DateTime AssignedDate { get; set; }

        public DateTime ProjectStartDate { get; set; }

        public DateTime ProjectEndDate { get; set; }

        public int TotalTasksGiven { get; set; }

        public int TotalCompletedTasks { get; set; }

        public decimal ProgressPercentage { get; set; }

        public string? OverallGrade { get; set; }
    }
}