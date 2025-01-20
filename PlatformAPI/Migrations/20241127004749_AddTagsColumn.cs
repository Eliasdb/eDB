using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTagsColumn : Migration
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
                    "0pzya3CsT6qYAzyof7kjJsUnFdUQxDJGecmU3UIfDT0=",
                    "o2cGKCMKNoKlwcD3Ia0Mug==",
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
                    "uI8OzJsA+aZTYD7O1ETIRMyk7PP2qfkwne4Ct7YFQQA=",
                    "wvledUVODinLUdeaexQs9Q==",
                }
            );
        }
    }
}
