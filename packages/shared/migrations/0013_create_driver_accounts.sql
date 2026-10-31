CREATE TABLE "driver_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"driver_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deactivated_at" timestamp with time zone,
	"deactivated_by" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "driver_accounts_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "driver_accounts_driver_id_unique" UNIQUE("driver_id"),
	CONSTRAINT "driver_accounts_deactivation_consistency" CHECK (("driver_accounts"."is_active" = true and "driver_accounts"."deactivated_at" is null and "driver_accounts"."deactivated_by" is null) or ("driver_accounts"."is_active" = false and "driver_accounts"."deactivated_at" is not null and "driver_accounts"."deactivated_by" is not null)),
	CONSTRAINT "driver_accounts_version_positive" CHECK ("driver_accounts"."version" >= 1),
	CONSTRAINT "driver_accounts_updated_after_created" CHECK ("driver_accounts"."updated_at" >= "driver_accounts"."created_at")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_driver_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_driver_id_drivers_id_fk";
--> statement-breakpoint
ALTER TABLE "driver_accounts" ADD CONSTRAINT "driver_accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_accounts" ADD CONSTRAINT "driver_accounts_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_accounts" ADD CONSTRAINT "driver_accounts_deactivated_by_user_id_fk" FOREIGN KEY ("deactivated_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "driver_id";