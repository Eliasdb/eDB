using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddNewUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Username", table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Users",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "Users",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "PreferredLanguage",
                table: "Users",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Users",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Address", table: "Users");

            migrationBuilder.DropColumn(name: "Company", table: "Users");

            migrationBuilder.DropColumn(name: "Country", table: "Users");

            migrationBuilder.DropColumn(name: "DisplayName", table: "Users");

            migrationBuilder.DropColumn(name: "FirstName", table: "Users");

            migrationBuilder.DropColumn(name: "LastName", table: "Users");

            migrationBuilder.DropColumn(name: "PasswordHash", table: "Users");

            migrationBuilder.DropColumn(name: "PreferredLanguage", table: "Users");

            migrationBuilder.DropColumn(name: "State", table: "Users");

            migrationBuilder.DropColumn(name: "Title", table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: ""
            );
        }
    }
}
