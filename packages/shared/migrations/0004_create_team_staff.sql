CREATE TABLE "team_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"team_id" uuid NOT NULL,
	"first_name" varchar(60) NOT NULL,
	"last_name" varchar(60) NOT NULL,
	"role_in_team" varchar(60) NOT NULL,
	"phone_number" varchar(30) NOT NULL,
	"file_number" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deactivated_at" timestamp with time zone,
	"deactivated_by" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_staff_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "team_staff_file_number_unique" UNIQUE("file_number"),
	CONSTRAINT "team_staff_first_name_not_blank" CHECK (char_length(btrim("team_staff"."first_name")) >= 1),
	CONSTRAINT "team_staff_last_name_not_blank" CHECK (char_length(btrim("team_staff"."last_name")) >= 1),
	CONSTRAINT "team_staff_role_in_team_length" CHECK (char_length(btrim("team_staff"."role_in_team")) >= 2),
	CONSTRAINT "team_staff_phone_number_format" CHECK ("team_staff"."phone_number" ~ '^[0-9+() -]{7,30}$'),
	CONSTRAINT "team_staff_file_number_format" CHECK ("team_staff"."file_number" ~ '^[A-Z0-9-]{1,20}$'),
	CONSTRAINT "team_staff_deactivation_consistency" CHECK (("team_staff"."is_active" = true and "team_staff"."deactivated_at" is null and "team_staff"."deactivated_by" is null) or ("team_staff"."is_active" = false and "team_staff"."deactivated_at" is not null and "team_staff"."deactivated_by" is not null)),
	CONSTRAINT "team_staff_version_positive" CHECK ("team_staff"."version" >= 1),
	CONSTRAINT "team_staff_updated_after_created" CHECK ("team_staff"."updated_at" >= "team_staff"."created_at")
);
--> statement-breakpoint
ALTER TABLE "team_staff" ADD CONSTRAINT "team_staff_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_staff" ADD CONSTRAINT "team_staff_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_staff" ADD CONSTRAINT "team_staff_deactivated_by_user_id_fk" FOREIGN KEY ("deactivated_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_staff_team_id_idx" ON "team_staff" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_staff_list_idx" ON "team_staff" USING btree ("is_active","last_name","first_name");