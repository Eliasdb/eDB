using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTagsField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Tags",
                table: "Applications",
                type: "text[]",
                nullable: false
            );

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Tags", table: "Applications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Salt" },
                values: new object[]
                {
                    "2uPmX8yJyroY6S/YlqyqiCiW+Nng5oDrj1H3m+aUiuw=",
                    "uaDL9cA/kEvKbq1qSJPzlw==",
                }
            );
        }
    }
}
