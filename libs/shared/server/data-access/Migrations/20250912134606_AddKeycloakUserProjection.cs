using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EDb.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddKeycloakUserProjection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "keycloak_users",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    external_id = table.Column<string>(type: "text", nullable: false),
                    username = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    email = table.Column<string>(
                        type: "character varying(320)",
                        maxLength: 320,
                        nullable: true
                    ),
                    first_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    last_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    email_verified = table.Column<bool>(type: "boolean", nullable: false),
                    synced_at = table.Column<DateTimeOffset>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    last_seen_at = table.Column<DateTimeOffset>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_keycloak_users", x => x.Id);
                }
            );

            migrationBuilder.CreateIndex(
                name: "ix_keycloak_users_email",
                table: "keycloak_users",
                column: "email"
            );

            migrationBuilder.CreateIndex(
                name: "ix_keycloak_users_is_deleted",
                table: "keycloak_users",
                column: "is_deleted"
            );

            migrationBuilder.CreateIndex(
                name: "ix_keycloak_users_last_name",
                table: "keycloak_users",
                column: "last_name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_keycloak_users_username",
                table: "keycloak_users",
                column: "username"
            );

            migrationBuilder.CreateIndex(
                name: "ux_keycloak_users_external_id",
                table: "keycloak_users",
                column: "external_id",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "keycloak_users");
        }
    }
}
