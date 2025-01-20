using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class CreateApplicationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Salt" },
                values: new object[]
                {
                    "C8y+HuzPkiqvg1zXDyvYXjG0VW9MSbRzKVMzeh5Ovek=",
                    "TeJlVNozH/4zFZXoEHjflQ==",
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Salt" },
                values: new object[]
                {
                    "0pzya3CsT6qYAzyof7kjJsUnFdUQxDJGecmU3UIfDT0=",
                    "o2cGKCMKNoKlwcD3Ia0Mug==",
                }
            );
        }
    }
}
