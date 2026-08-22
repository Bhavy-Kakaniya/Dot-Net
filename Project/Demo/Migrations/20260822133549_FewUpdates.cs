using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Demo.Migrations
{
    /// <inheritdoc />
    public partial class FewUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Faculties_facultyid",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "facultyid",
                table: "Students",
                newName: "FacultyId");

            migrationBuilder.RenameColumn(
                name: "course",
                table: "Students",
                newName: "Course");

            migrationBuilder.RenameColumn(
                name: "age",
                table: "Students",
                newName: "Age");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Students",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Students_facultyid",
                table: "Students",
                newName: "IX_Students_FacultyId");

            migrationBuilder.RenameColumn(
                name: "salary",
                table: "Faculties",
                newName: "Salary");

            migrationBuilder.RenameColumn(
                name: "department",
                table: "Faculties",
                newName: "Department");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Faculties",
                newName: "Id");

            migrationBuilder.AlterColumn<decimal>(
                name: "Salary",
                table: "Faculties",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Faculties_FacultyId",
                table: "Students",
                column: "FacultyId",
                principalTable: "Faculties",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Faculties_FacultyId",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "FacultyId",
                table: "Students",
                newName: "facultyid");

            migrationBuilder.RenameColumn(
                name: "Course",
                table: "Students",
                newName: "course");

            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Students",
                newName: "age");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Students",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_Students_FacultyId",
                table: "Students",
                newName: "IX_Students_facultyid");

            migrationBuilder.RenameColumn(
                name: "Salary",
                table: "Faculties",
                newName: "salary");

            migrationBuilder.RenameColumn(
                name: "Department",
                table: "Faculties",
                newName: "department");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Faculties",
                newName: "id");

            migrationBuilder.AlterColumn<int>(
                name: "salary",
                table: "Faculties",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Faculties_facultyid",
                table: "Students",
                column: "facultyid",
                principalTable: "Faculties",
                principalColumn: "id");
        }
    }
}
