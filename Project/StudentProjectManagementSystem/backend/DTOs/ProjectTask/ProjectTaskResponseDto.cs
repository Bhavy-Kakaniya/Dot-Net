namespace StudentProjectManagementSystem.DTOs.ProjectTask
{
    public class ProjectTaskResponseDto
    {
        public int TaskId { get; set; }

        public int ProjectAllocationId { get; set; }

        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        public DateTime AssignedDate { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? SubmissionDate { get; set; }

        public int AssignedByFacultyId { get; set; }

        public int AssignedToStudentId { get; set; }

        public int TaskStatusId { get; set; }

        public int TaskPriorityId { get; set; }
    }
}