import { pgTable, type AnyPgColumn, foreignKey, check, text, timestamp, jsonb, integer, index, boolean, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const companies = pgTable("companies", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	website: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stage: text().default('lead'),
	industry: text(),
	description: text(),
	hq: jsonb(),
	employees: integer(),
	employeesRange: text("employees_range"),
	ownerContactId: text("owner_contact_id"),
	primaryEmail: text("primary_email"),
	phone: text(),
}, (table) => [
	foreignKey({
			columns: [table.ownerContactId],
			foreignColumns: [contacts.id],
			name: "companies_owner_fk"
		}).onDelete("set null"),
	check("companies_stage_check", sql`stage = ANY (ARRAY['lead'::text, 'prospect'::text, 'customer'::text, 'inactive'::text])`),
]);

export const contacts = pgTable("contacts", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text(),
	phone: text(),
	companyId: text("company_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_contacts_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "contacts_company_id_fkey"
		}).onDelete("set null"),
]);

export const activities = pgTable("activities", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	summary: text().notNull(),
	contactId: text("contact_id"),
	companyId: text("company_id"),
	at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_acts_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	index("idx_acts_contact").using("btree", table.contactId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contacts.id],
			name: "activities_contact_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "activities_company_id_fkey"
		}).onDelete("set null"),
]);

export const tasks = pgTable("tasks", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	done: boolean().default(false).notNull(),
	due: date(),
	contactId: text("contact_id"),
	companyId: text("company_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_tasks_company").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	index("idx_tasks_contact").using("btree", table.contactId.asc().nullsLast().op("text_ops")),
	index("idx_tasks_due").using("btree", table.due.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contacts.id],
			name: "tasks_contact_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "tasks_company_id_fkey"
		}).onDelete("set null"),
]);
