using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EDb.DataAccess.Migrations
{
  /// <inheritdoc />
  public partial class AddIsSubscribedField : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
        name: "Applications",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "integer", nullable: false)
            .Annotation(
              "Npgsql:ValueGenerationStrategy",
              NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            ),
          Name = table.Column<string>(type: "text", nullable: false),
          Description = table.Column<string>(type: "text", nullable: false),
          IconUrl = table.Column<string>(type: "text", nullable: false),
          RoutePath = table.Column<string>(type: "text", nullable: false),
          Tags = table.Column<List<string>>(type: "text[]", nullable: false),
          IsSubscribed = table.Column<bool>(type: "boolean", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Applications", x => x.Id);
        }
      );

      migrationBuilder.CreateTable(
        name: "Users",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "integer", nullable: false)
            .Annotation(
              "Npgsql:ValueGenerationStrategy",
              NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            ),
          Email = table.Column<string>(type: "text", nullable: false),
          PasswordHash = table.Column<string>(type: "text", nullable: false),
          FirstName = table.Column<string>(type: "text", nullable: false),
          LastName = table.Column<string>(type: "text", nullable: false),
          Country = table.Column<string>(type: "text", nullable: false),
          State = table.Column<string>(type: "text", nullable: false),
          Company = table.Column<string>(type: "text", nullable: false),
          DisplayName = table.Column<string>(type: "text", nullable: true),
          PreferredLanguage = table.Column<string>(type: "text", nullable: true),
          Title = table.Column<string>(type: "text", nullable: true),
          Address = table.Column<string>(type: "text", nullable: true),
          Salt = table.Column<string>(type: "text", nullable: true),
          Role = table.Column<string>(type: "text", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Users", x => x.Id);
        }
      );

      migrationBuilder.CreateTable(
        name: "Subscriptions",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "integer", nullable: false)
            .Annotation(
              "Npgsql:ValueGenerationStrategy",
              NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            ),
          UserId = table.Column<int>(type: "integer", nullable: false),
          ApplicationId = table.Column<int>(type: "integer", nullable: false),
          SubscriptionDate = table.Column<DateTime>(
            type: "timestamp with time zone",
            nullable: false
          ),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Subscriptions", x => x.Id);
          table.ForeignKey(
            name: "FK_Subscriptions_Applications_ApplicationId",
            column: x => x.ApplicationId,
            principalTable: "Applications",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
          );
          table.ForeignKey(
            name: "FK_Subscriptions_Users_UserId",
            column: x => x.UserId,
            principalTable: "Users",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
          );
        }
      );

      migrationBuilder.CreateIndex(
        name: "IX_Subscriptions_ApplicationId",
        table: "Subscriptions",
        column: "ApplicationId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_Subscriptions_UserId",
        table: "Subscriptions",
        column: "UserId"
      );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(name: "Subscriptions");

      migrationBuilder.DropTable(name: "Applications");

      migrationBuilder.DropTable(name: "Users");
    }
  }
}
