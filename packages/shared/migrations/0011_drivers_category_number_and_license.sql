ALTER TABLE "drivers" DROP CONSTRAINT "drivers_number_unique";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_license_length";--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
UPDATE "drivers" SET "category_id" = "teams"."category_id" FROM "teams" WHERE "drivers"."team_id" = "teams"."id";--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_category_number_unique" UNIQUE("category_id","number");--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_license_unique" UNIQUE("license");--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_license_format" CHECK ("drivers"."license" is null or "drivers"."license" ~ '^[A-Za-z0-9-]{3,20}$');