using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentProjectManagementSystem.Data;
using StudentProjectManagementSystem.DTOs.Common;

namespace StudentProjectManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Total number of students

        [HttpGet("total-students")]
        public async Task<IActionResult> GetTotalStudents()
        {
            var totalStudents = await _context.Users.CountAsync(x => x.UserType != null && x.UserType.UserTypeName == "Student");
            return Ok(ApiResponse<object>.SuccessResponse("Total students retrieved successfully", totalStudents));
        }

        // 2. Total number of faculty members

        [HttpGet("total-faculty")]
        public async Task<IActionResult> GetTotalFaculty()
        {
            var totalFaculty = await _context.Users.CountAsync(x => x.UserType != null && x.UserType.UserTypeName == "Faculty");
            return Ok(ApiResponse<object>.SuccessResponse("Total faculty retrieved successfully", totalFaculty));
        }

        // 3. Total number of projects

        [HttpGet("total-projects")]
        public async Task<IActionResult> GetTotalProjects()
        {
            var totalProjects = await _context.Projects.CountAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Total projects retrieved successfully", totalProjects));
        }

        // 4. Task count by status

        [HttpGet("tasks-by-status")]
        public async Task<IActionResult> GetTasksByStatus()
        {
            var result = await _context.ProjectTasks.GroupBy(x => x.ProjectTaskStatus!.TaskStatusName).Select(g => new { TaskStatus = g.Key, TotalTasks = g.Count() }).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Task count by status retrieved successfully", result));
        }

        // 5. Task count by priority

        [HttpGet("tasks-by-priority")]
        public async Task<IActionResult> GetTasksByPriority()
        {
            var result = await _context.ProjectTasks.GroupBy(x => x.ProjectTaskPriority!.TaskPriorityName).Select(g => new { Priority = g.Key, TotalTasks = g.Count() }).OrderByDescending(x => x.TotalTasks).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Task count by priority retrieved successfully", result));
        }

        // 6. Number of projects assigned to each faculty member

        [HttpGet("faculty-workload")]
        public async Task<IActionResult> GetFacultyWorkload()
        {
            var result = await _context.ProjectAllocations.GroupBy(x => x.Faculty!.FullName).Select(g => new { FacultyName = g.Key, TotalProjects = g.Count() }).OrderByDescending(x => x.TotalProjects).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Faculty workload retrieved successfully", result));
        }

        // 7. Number of tasks assigned to each student

        [HttpGet("student-task-count")]
        public async Task<IActionResult> GetStudentTaskCount()
        {
            var result = await _context.ProjectTasks.GroupBy(x => x.ProjectAllocation!.Student!.FullName).Select(g => new { StudentName = g.Key, TotalTasks = g.Count() }).OrderByDescending(x => x.TotalTasks).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Student task count retrieved successfully", result));
        }

        // 8. Top 10 students based on average earned score

        [HttpGet("top-students")]
        public async Task<IActionResult> GetTopStudents()
        {
            var result = await _context.ProjectTasks.Where(x => x.EarnedScore != null).GroupBy(x => x.ProjectAllocation!.Student!.FullName).Select(g => new { StudentName = g.Key, AverageScore = g.Average(x => x.EarnedScore) }).OrderByDescending(x => x.AverageScore).Take(10).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Top students retrieved successfully", result));
        }

        // 9. Bottom 10 students based on average earned score

        [HttpGet("bottom-students")]
        public async Task<IActionResult> GetBottomStudents()
        {
            var result = await _context.ProjectTasks.Where(x => x.EarnedScore != null).GroupBy(x => x.ProjectAllocation!.Student!.FullName).Select(g => new { StudentName = g.Key, AverageScore = g.Average(x => x.EarnedScore) }).OrderBy(x => x.AverageScore).Take(10).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Bottom students retrieved successfully", result));
        }

        // 10. Display overdue tasks

        [HttpGet("overdue-tasks")]
        public async Task<IActionResult> GetOverdueTasks()
        {
            var result = await _context.ProjectTasks.Where(x => x.TaskDueDate != null && x.TaskDueDate < DateTime.Now && x.ProjectTaskStatus!.TaskStatusName != "Completed").Select(x => new { x.TaskId, x.TaskTitle, Student = x.ProjectAllocation!.Student!.FullName, Faculty = x.ProjectAllocation!.Faculty!.FullName, x.TaskDueDate, Status = x.ProjectTaskStatus!.TaskStatusName }).OrderBy(x => x.TaskDueDate).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Overdue tasks retrieved successfully", result));
        }

        // 11. Display projects with their student and faculty

        [HttpGet("project-details")]
        public async Task<IActionResult> GetProjectDetails()
        {
            var result = await _context.ProjectAllocations.Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.ProjectStartDate, x.ProjectEndDate, x.ProgressPercentage }).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Project details retrieved successfully", result));
        }

        // 12. Display projects with progress less than 50%

        [HttpGet("low-progress-projects")]
        public async Task<IActionResult> GetLowProgressProjects()
        {
            var result = await _context.ProjectAllocations.Where(x => x.ProgressPercentage < 50).Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.ProgressPercentage }).OrderBy(x => x.ProgressPercentage).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Low progress projects retrieved successfully", result));
        }

        // 13. Display month-wise completed task count

        [HttpGet("monthly-completed-tasks")]
        public async Task<IActionResult> GetMonthlyCompletedTasks()
        {
            var result = await _context.ProjectTasks.Where(x => x.TaskCompletedDate != null).GroupBy(x => new { Year = x.TaskCompletedDate!.Value.Year, Month = x.TaskCompletedDate!.Value.Month }).Select(g => new { g.Key.Year, g.Key.Month, TotalCompletedTasks = g.Count() }).OrderBy(x => x.Year).ThenBy(x => x.Month).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Monthly completed tasks retrieved successfully", result));
        }

        // 14. Display role-wise active user count

        [HttpGet("role-wise-active-users")]
        public async Task<IActionResult> GetRoleWiseActiveUsers()
        {
            var result = await _context.UserRoles.Where(x => x.User!.IsActive).GroupBy(x => x.Role!.RoleName).Select(g => new { RoleName = g.Key, ActiveUsers = g.Count() }).OrderByDescending(x => x.ActiveUsers).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Role-wise active users retrieved successfully", result));
        }

        // 15. Display each role with users assigned to it

        [HttpGet("role-users")]
        public async Task<IActionResult> GetRoleUsers()
        {
            var result = await _context.UserRoles.GroupBy(x => x.Role!.RoleName).Select(g => new { RoleName = g.Key, Users = g.Select(x => x.User!.FullName).ToList() }).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Role users retrieved successfully", result));
        }

        // 16. List roles having more than 10 users

        [HttpGet("roles-more-than-10-users")]
        public async Task<IActionResult> GetRolesMoreThan10Users()
        {
            var result = await _context.UserRoles.GroupBy(x => x.Role!.RoleName).Select(g => new { RoleName = g.Key, TotalUsers = g.Count() }).Where(x => x.TotalUsers > 10).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Roles with more than 10 users retrieved successfully", result));
        }

        // 17. Display role statistics

        [HttpGet("role-statistics")]
        public async Task<IActionResult> GetRoleStatistics()
        {
            var result = await _context.UserRoles.GroupBy(x => x.Role!.RoleName).Select(g => new { RoleName = g.Key, TotalUsers = g.Count(), ActiveUsers = g.Count(x => x.User!.IsActive), InactiveUsers = g.Count(x => !x.User!.IsActive) }).OrderByDescending(x => x.TotalUsers).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Role statistics retrieved successfully", result));
        }

        // 18. Show tasks due within the next 7 days

        [HttpGet("tasks-due-next-7-days")]
        public async Task<IActionResult> GetTasksDueNext7Days()
        {
            var today = DateTime.Now; var nextSevenDays = today.AddDays(7);
            var result = await _context.ProjectTasks.Where(x => x.TaskDueDate != null && x.TaskDueDate >= today && x.TaskDueDate <= nextSevenDays && x.ProjectTaskStatus!.TaskStatusName != "Completed").Select(x => new { x.TaskId, x.TaskTitle, Student = x.ProjectAllocation!.Student!.FullName, Faculty = x.ProjectAllocation!.Faculty!.FullName, x.TaskDueDate, Status = x.ProjectTaskStatus!.TaskStatusName }).OrderBy(x => x.TaskDueDate).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Tasks due within next 7 days retrieved successfully", result));
        }

        // 19. Display top 10 projects based on progress

        [HttpGet("top-projects-by-progress")]
        public async Task<IActionResult> GetTopProjectsByProgress()
        {
            var result = await _context.ProjectAllocations.Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.ProgressPercentage }).OrderByDescending(x => x.ProgressPercentage).Take(10).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Top projects by progress retrieved successfully", result));
        }

        // 20. Display projects with zero completed tasks

        [HttpGet("projects-zero-completed-tasks")]
        public async Task<IActionResult> GetProjectsWithZeroCompletedTasks()
        {
            var result = await _context.ProjectAllocations.Where(x => x.TotalCompletedTasks == 0).Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.TotalTasksGiven, x.TotalCompletedTasks, x.ProgressPercentage }).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Projects with zero completed tasks retrieved successfully", result));
        }

        // 21. Average progress of all projects
        [HttpGet("average-project-progress")]
        public async Task<IActionResult> GetAverageProjectProgress()
        {
            var result = await _context.ProjectAllocations.AverageAsync(x => x.ProgressPercentage); return Ok(ApiResponse<object>.SuccessResponse("Average project progress retrieved successfully", new { AverageProgress = result }));
        }

        // 22. Count projects by progress range

        [HttpGet("projects-by-progress-range")]
        public async Task<IActionResult> GetProjectsByProgressRange()
        {
            var result = await _context.ProjectAllocations.GroupBy(x => x.ProgressPercentage < 25 ? "0-24%" : x.ProgressPercentage < 50 ? "25-49%" : x.ProgressPercentage < 75 ? "50-74%" : "75-100%").Select(g => new { ProgressRange = g.Key, TotalProjects = g.Count() }).OrderBy(x => x.ProgressRange).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Projects by progress range retrieved successfully", result));
        }

        // 23. Faculty-wise average project progress

        [HttpGet("faculty-average-progress")]
        public async Task<IActionResult> GetFacultyAverageProgress()
        {
            var result = await _context.ProjectAllocations.GroupBy(x => x.Faculty!.FullName).Select(g => new { FacultyName = g.Key, AverageProgress = g.Average(x => x.ProgressPercentage), TotalProjects = g.Count() }).OrderByDescending(x => x.AverageProgress).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Faculty average project progress retrieved successfully", result));
        }

        // 24. Student-wise project progress

        [HttpGet("student-project-progress")]
        public async Task<IActionResult> GetStudentProjectProgress()
        {
            var result = await _context.ProjectAllocations.GroupBy(x => x.Student!.FullName).Select(g => new { StudentName = g.Key, TotalProjects = g.Count(), AverageProgress = g.Average(x => x.ProgressPercentage), CompletedTasks = g.Sum(x => x.TotalCompletedTasks), TotalTasks = g.Sum(x => x.TotalTasksGiven) }).OrderByDescending(x => x.AverageProgress).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Student project progress retrieved successfully", result));
        }

        // 25. Projects ending within the next 30 days

        [HttpGet("projects-ending-next-30-days")]
        public async Task<IActionResult> GetProjectsEndingNext30Days()
        {
            var today = DateTime.Now; var nextThirtyDays = today.AddDays(30);
            var result = await _context.ProjectAllocations.Where(x => x.ProjectEndDate >= today && x.ProjectEndDate <= nextThirtyDays).Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.ProjectEndDate, x.ProgressPercentage }).OrderBy(x => x.ProjectEndDate).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Projects ending within next 30 days retrieved successfully", result));
        }

        // 26. Task count by status and priority

        [HttpGet("tasks-by-status-and-priority")]
        public async Task<IActionResult> GetTasksByStatusAndPriority()
        {
            var result = await _context.ProjectTasks.GroupBy(x => new { Status = x.ProjectTaskStatus!.TaskStatusName, Priority = x.ProjectTaskPriority!.TaskPriorityName }).Select(g => new { g.Key.Status, g.Key.Priority, TotalTasks = g.Count() }).OrderBy(x => x.Status).ThenBy(x => x.Priority).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Tasks by status and priority retrieved successfully", result));
        }

        // 27. Faculty-wise task statistics

        [HttpGet("faculty-task-statistics")]
        public async Task<IActionResult> GetFacultyTaskStatistics()
        {
            var result = await _context.ProjectTasks.GroupBy(x => x.ProjectAllocation!.Faculty!.FullName).Select(g => new { FacultyName = g.Key, TotalTasks = g.Count(), CompletedTasks = g.Count(x => x.ProjectTaskStatus!.TaskStatusName == "Completed"), PendingTasks = g.Count(x => x.ProjectTaskStatus!.TaskStatusName != "Completed"), AverageProgress = g.Average(x => x.ProgressPercentage) }).OrderByDescending(x => x.TotalTasks).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Faculty task statistics retrieved successfully", result));
        }

        // 28. Student-wise task statistics

        [HttpGet("student-task-statistics")]
        public async Task<IActionResult> GetStudentTaskStatistics()
        {
            var result = await _context.ProjectTasks.GroupBy(x => x.ProjectAllocation!.Student!.FullName).Select(g => new { StudentName = g.Key, TotalTasks = g.Count(), CompletedTasks = g.Count(x => x.ProjectTaskStatus!.TaskStatusName == "Completed"), PendingTasks = g.Count(x => x.ProjectTaskStatus!.TaskStatusName != "Completed"), AverageProgress = g.Average(x => x.ProgressPercentage), AverageEarnedScore = g.Where(x => x.EarnedScore != null).Average(x => x.EarnedScore) }).OrderByDescending(x => x.AverageProgress).ToListAsync();
            return Ok(ApiResponse<object>.SuccessResponse("Student task statistics retrieved successfully", result));
        }

        // 29. Projects with all tasks completed

        [HttpGet("projects-all-tasks-completed")]
        public async Task<IActionResult> GetProjectsWithAllTasksCompleted()
        {
            var result = await _context.ProjectAllocations.Where(x => x.TotalTasksGiven > 0 && x.TotalTasksGiven == x.TotalCompletedTasks).Select(x => new { Project = x.Project!.ProjectTitle, Student = x.Student!.FullName, Faculty = x.Faculty!.FullName, x.TotalTasksGiven, x.TotalCompletedTasks, x.ProgressPercentage }).ToListAsync(); return Ok(ApiResponse<object>.SuccessResponse("Projects with all tasks completed retrieved successfully", result));
        }

        // 30. Overall dashboard summary

        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var totalStudents = await _context.Users.CountAsync(x => x.UserType != null && x.UserType.UserTypeName == "Student");
            var totalFaculty = await _context.Users.CountAsync(x => x.UserType != null && x.UserType.UserTypeName == "Faculty");
            var totalProjects = await _context.Projects.CountAsync();
            var totalTasks = await _context.ProjectTasks.CountAsync();
            var completedTasks = await _context.ProjectTasks.CountAsync(x => x.ProjectTaskStatus!.TaskStatusName == "Completed");
            var pendingTasks = await _context.ProjectTasks.CountAsync(x => x.ProjectTaskStatus!.TaskStatusName != "Completed");
            var averageProgress = await _context.ProjectAllocations.Select(x => (decimal?)x.ProgressPercentage).AverageAsync() ?? 0;
            var result = new { TotalStudents = totalStudents, TotalFaculty = totalFaculty, TotalProjects = totalProjects, TotalTasks = totalTasks, CompletedTasks = completedTasks, PendingTasks = pendingTasks, AverageProjectProgress = averageProgress };
            return Ok(ApiResponse<object>.SuccessResponse("Dashboard summary retrieved successfully", result));
        }
    }
}