using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Draft.Migrations
{
    /// <inheritdoc />
    public partial class new_link : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId1",
                table: "UserRoles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExecutorId1",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId1",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TagId1",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId1",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaskItemId1",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_ProjectId1",
                table: "UserRoles",
                column: "ProjectId1");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ExecutorId1",
                table: "Tasks",
                column: "ExecutorId1");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId1",
                table: "Tasks",
                column: "ProjectId1");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_TagId1",
                table: "Tasks",
                column: "TagId1");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AuthorId1",
                table: "Comments",
                column: "AuthorId1");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_TaskItemId1",
                table: "Comments",
                column: "TaskItemId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Tasks_TaskItemId1",
                table: "Comments",
                column: "TaskItemId1",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_AuthorId1",
                table: "Comments",
                column: "AuthorId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectId1",
                table: "Tasks",
                column: "ProjectId1",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Tags_TagId1",
                table: "Tasks",
                column: "TagId1",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_ExecutorId1",
                table: "Tasks",
                column: "ExecutorId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Projects_ProjectId1",
                table: "UserRoles",
                column: "ProjectId1",
                principalTable: "Projects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Tasks_TaskItemId1",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_AuthorId1",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectId1",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Tags_TagId1",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_ExecutorId1",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Projects_ProjectId1",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_ProjectId1",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ExecutorId1",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ProjectId1",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_TagId1",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Comments_AuthorId1",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_TaskItemId1",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "ProjectId1",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "ExecutorId1",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ProjectId1",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "TagId1",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "AuthorId1",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "TaskItemId1",
                table: "Comments");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
