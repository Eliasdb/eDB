ALTER TABLE "companies" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hq" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "employees" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "employees_range" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "owner_contact_id" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "primary_email" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_fk" FOREIGN KEY ("owner_contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;