import { relations } from "drizzle-orm/relations";
import { contacts, companies, activities, tasks } from "./schema";

export const companiesRelations = relations(companies, ({one, many}) => ({
	contact: one(contacts, {
		fields: [companies.ownerContactId],
		references: [contacts.id],
		relationName: "companies_ownerContactId_contacts_id"
	}),
	contacts: many(contacts, {
		relationName: "contacts_companyId_companies_id"
	}),
	activities: many(activities),
	tasks: many(tasks),
}));

export const contactsRelations = relations(contacts, ({one, many}) => ({
	companies: many(companies, {
		relationName: "companies_ownerContactId_contacts_id"
	}),
	company: one(companies, {
		fields: [contacts.companyId],
		references: [companies.id],
		relationName: "contacts_companyId_companies_id"
	}),
	activities: many(activities),
	tasks: many(tasks),
}));

export const activitiesRelations = relations(activities, ({one}) => ({
	contact: one(contacts, {
		fields: [activities.contactId],
		references: [contacts.id]
	}),
	company: one(companies, {
		fields: [activities.companyId],
		references: [companies.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	contact: one(contacts, {
		fields: [tasks.contactId],
		references: [contacts.id]
	}),
	company: one(companies, {
		fields: [tasks.companyId],
		references: [companies.id]
	}),
}));