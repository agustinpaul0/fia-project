CREATE TABLE "technical_controls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"driver_id" uuid,
	"car_number" integer NOT NULL,
	"race_id" uuid,
	"control_type" varchar(40) NOT NULL,
	"status" varchar(20) NOT NULL,
	"notes" text,
	"inspected_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tech_controls_car_number_range" CHECK ("technical_controls"."car_number" between 1 and 99),
	CONSTRAINT "tech_controls_type_valid" CHECK ("technical_controls"."control_type" in ('weight', 'fuel', 'dimensions', 'engine', 'safety', 'post_race')),
	CONSTRAINT "tech_controls_status_valid" CHECK ("technical_controls"."status" in ('passed', 'rejected')),
	CONSTRAINT "tech_controls_expires_after_inspection" CHECK ("technical_controls"."expires_at" > "technical_controls"."inspected_at"),
	CONSTRAINT "technical_controls_version_positive" CHECK ("technical_controls"."version" >= 1),
	CONSTRAINT "technical_controls_updated_after_created" CHECK ("technical_controls"."updated_at" >= "technical_controls"."created_at")
);
--> statement-breakpoint
ALTER TABLE "technical_controls" ADD CONSTRAINT "technical_controls_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_controls" ADD CONSTRAINT "technical_controls_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_controls" ADD CONSTRAINT "technical_controls_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tech_controls_team_id_idx" ON "technical_controls" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "tech_controls_driver_id_idx" ON "technical_controls" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "tech_controls_race_id_idx" ON "technical_controls" USING btree ("race_id");--> statement-breakpoint
CREATE INDEX "tech_controls_status_idx" ON "technical_controls" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tech_controls_inspected_at_idx" ON "technical_controls" USING btree ("inspected_at");