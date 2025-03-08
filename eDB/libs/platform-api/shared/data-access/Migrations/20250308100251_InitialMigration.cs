using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EDb.DataAccess.Migrations
{
  /// <inheritdoc />
  public partial class InitialMigration : Migration
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
        name: "Subscriptions",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "integer", nullable: false)
            .Annotation(
              "Npgsql:ValueGenerationStrategy",
              NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            ),
          KeycloakUserId = table.Column<string>(type: "text", nullable: false),
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
        }
      );

      migrationBuilder.CreateIndex(
        name: "IX_Subscriptions_ApplicationId",
        table: "Subscriptions",
        column: "ApplicationId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_Subscriptions_KeycloakUserId",
        table: "Subscriptions",
        column: "KeycloakUserId"
      );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(name: "Subscriptions");

      migrationBuilder.DropTable(name: "Applications");
    }
  }
}
