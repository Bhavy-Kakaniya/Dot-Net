using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentProjectManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class CreatingDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskPriorities_ProjectTaskPriorityId",
                table: "ProjectTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_Users_AssignedByFacultyId",
                table: "ProjectTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_Users_AssignedToStudentId",
                table: "ProjectTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_UserId_RoleId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_AssignedByFacultyId",
                table: "ProjectTasks");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_AssignedToStudentId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "StatusName",
                table: "TaskStatuses");

            migrationBuilder.DropColumn(
                name: "PriorityName",
                table: "TaskPriorities");

            migrationBuilder.DropColumn(
                name: "AssignedByFacultyId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "AssignedDate",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "AssignedToStudentId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "StatusName",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "UserRoleId",
                table: "UserRoles",
                newName: "RolePermissionId");

            migrationBuilder.RenameColumn(
                name: "ProjectTaskPriorityId",
                table: "TaskPriorities",
                newName: "TaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "SubmissionDate",
                table: "ProjectTasks",
                newName: "TaskStartDate");

            migrationBuilder.RenameColumn(
                name: "ProjectTaskPriorityId",
                table: "ProjectTasks",
                newName: "TaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "DueDate",
                table: "ProjectTasks",
                newName: "TaskAssignedDate");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_ProjectTaskPriorityId",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_TaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "TotalTasks",
                table: "ProjectAllocations",
                newName: "TotalTasksGiven");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "ProjectAllocations",
                newName: "ProjectStartDate");

            migrationBuilder.RenameColumn(
                name: "Progress",
                table: "ProjectAllocations",
                newName: "ProgressPercentage");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "ProjectAllocations",
                newName: "ProjectEndDate");

            migrationBuilder.RenameColumn(
                name: "CompletedTasks",
                table: "ProjectAllocations",
                newName: "TotalCompletedTasks");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "UserTypes",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserCode",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicturePath",
                table: "Users",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MobileNumber",
                table: "Users",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "TaskStatusCssClass",
                table: "TaskStatuses",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaskStatusName",
                table: "TaskStatuses",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaskPriorityCssClass",
                table: "TaskPriorities",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaskPriorityName",
                table: "TaskPriorities",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Roles",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AssignedScore",
                table: "ProjectTasks",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "EarnedScore",
                table: "ProjectTasks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacultyRemarks",
                table: "ProjectTasks",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextFollowUpDate",
                table: "ProjectTasks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProgressPercentage",
                table: "ProjectTasks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentRemarks",
                table: "ProjectTasks",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TaskCompletedDate",
                table: "ProjectTasks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TaskDueDate",
                table: "ProjectTasks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProjectTitle",
                table: "Projects",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OverallGrade",
                table: "ProjectAllocations",
                type: "nvarchar(1)",
                maxLength: 1,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedDate",
                table: "ProjectAllocations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskPriorities_TaskPriorityId",
                table: "ProjectTasks",
                column: "TaskPriorityId",
                principalTable: "TaskPriorities",
                principalColumn: "TaskPriorityId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskPriorities_TaskPriorityId",
                table: "ProjectTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "UserTypes");

            migrationBuilder.DropColumn(
                name: "TaskStatusCssClass",
                table: "TaskStatuses");

            migrationBuilder.DropColumn(
                name: "TaskStatusName",
                table: "TaskStatuses");

            migrationBuilder.DropColumn(
                name: "TaskPriorityCssClass",
                table: "TaskPriorities");

            migrationBuilder.DropColumn(
                name: "TaskPriorityName",
                table: "TaskPriorities");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "AssignedScore",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "EarnedScore",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "FacultyRemarks",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "NextFollowUpDate",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "ProgressPercentage",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "StudentRemarks",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "TaskCompletedDate",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "TaskDueDate",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AssignedDate",
                table: "ProjectAllocations");

            migrationBuilder.RenameColumn(
                name: "RolePermissionId",
                table: "UserRoles",
                newName: "UserRoleId");

            migrationBuilder.RenameColumn(
                name: "TaskPriorityId",
                table: "TaskPriorities",
                newName: "ProjectTaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "TaskStartDate",
                table: "ProjectTasks",
                newName: "SubmissionDate");

            migrationBuilder.RenameColumn(
                name: "TaskPriorityId",
                table: "ProjectTasks",
                newName: "ProjectTaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "TaskAssignedDate",
                table: "ProjectTasks",
                newName: "DueDate");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_TaskPriorityId",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_ProjectTaskPriorityId");

            migrationBuilder.RenameColumn(
                name: "TotalTasksGiven",
                table: "ProjectAllocations",
                newName: "TotalTasks");

            migrationBuilder.RenameColumn(
                name: "TotalCompletedTasks",
                table: "ProjectAllocations",
                newName: "CompletedTasks");

            migrationBuilder.RenameColumn(
                name: "ProjectStartDate",
                table: "ProjectAllocations",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "ProjectEndDate",
                table: "ProjectAllocations",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "ProgressPercentage",
                table: "ProjectAllocations",
                newName: "Progress");

            migrationBuilder.AlterColumn<string>(
                name: "UserCode",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicturePath",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "MobileNumber",
                table: "Users",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "StatusName",
                table: "TaskStatuses",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PriorityName",
                table: "TaskPriorities",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "AssignedByFacultyId",
                table: "ProjectTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedDate",
                table: "ProjectTasks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "AssignedToStudentId",
                table: "ProjectTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ProjectTitle",
                table: "Projects",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "StatusName",
                table: "Projects",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "OverallGrade",
                table: "ProjectAllocations",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1)",
                oldMaxLength: 1,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId_RoleId",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_AssignedByFacultyId",
                table: "ProjectTasks",
                column: "AssignedByFacultyId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_AssignedToStudentId",
                table: "ProjectTasks",
                column: "AssignedToStudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskPriorities_ProjectTaskPriorityId",
                table: "ProjectTasks",
                column: "ProjectTaskPriorityId",
                principalTable: "TaskPriorities",
                principalColumn: "ProjectTaskPriorityId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_Users_AssignedByFacultyId",
                table: "ProjectTasks",
                column: "AssignedByFacultyId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_Users_AssignedToStudentId",
                table: "ProjectTasks",
                column: "AssignedToStudentId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
