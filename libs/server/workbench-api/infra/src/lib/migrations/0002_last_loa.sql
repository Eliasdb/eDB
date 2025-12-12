ALTER TABLE "gadgets" DROP CONSTRAINT "gadgets_supplier_id_suppliers_id_fk";
--> statement-breakpoint
ALTER TABLE "gadgets" ADD CONSTRAINT "gadgets_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE cascade;