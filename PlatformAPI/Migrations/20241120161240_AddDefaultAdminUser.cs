using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[]
                {
                    "Id",
                    "Address",
                    "Company",
                    "Country",
                    "DisplayName",
                    "Email",
                    "FirstName",
                    "LastName",
                    "PasswordHash",
                    "PreferredLanguage",
                    "Role",
                    "Salt",
                    "State",
                    "Title",
                },
                values: new object[]
                {
                    1,
                    "123 Admin Street",
                    "AdminCorp",
                    "Adminland",
                    "Administrator",
                    "admin@example.com",
                    "Admin",
                    "User",
                    "q1qlpekPQispRozmuifYm5VpGXBDJO5iJTa6yJ92kOk=",
                    "en",
                    "Admin",
                    "QFZFjubxhlunRPEVN4AVmg==",
                    "Adminstate",
                    "System Admin",
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "Users", keyColumn: "Id", keyValue: 1);
        }
    }
}
