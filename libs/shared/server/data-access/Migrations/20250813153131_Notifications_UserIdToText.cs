using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EDb.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Notifications_UserIdToText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                  DROP INDEX IF EXISTS ix_recipients_user_unread;
                  DROP INDEX IF EXISTS ix_recipients_user;
                  ALTER TABLE notification_recipients
                    ALTER COLUMN user_id TYPE text USING user_id::text;
                  CREATE INDEX ix_recipients_user ON notification_recipients (user_id);
                  CREATE INDEX ix_recipients_user_unread ON notification_recipients (user_id) WHERE read_at IS NULL;
                """
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                  DROP INDEX IF EXISTS ix_recipients_user_unread;
                  DROP INDEX IF EXISTS ix_recipients_user;
                  ALTER TABLE notification_recipients
                    ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
                  CREATE INDEX ix_recipients_user ON notification_recipients (user_id);
                  CREATE INDEX ix_recipients_user_unread ON notification_recipients (user_id) WHERE read_at IS NULL;
                """
            );
        }
    }
}
