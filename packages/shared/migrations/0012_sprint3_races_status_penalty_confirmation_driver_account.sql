ALTER TABLE "user" ADD COLUMN "driver_id" uuid;--> statement-breakpoint
ALTER TABLE "penalties" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "penalties" ADD COLUMN "confirmed_by_user_id" text;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "status" varchar(20) DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "updated_by_user_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_confirmed_by_user_id_user_id_fk" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_driver_id_unique" UNIQUE("driver_id");--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_confirmation_complete" CHECK (("penalties"."confirmed_at" is null) = ("penalties"."confirmed_by_user_id" is null));--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_status_valid" CHECK ("races"."status" in ('scheduled', 'modified', 'cancelled'));