CREATE TABLE "penalties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"driver_id" uuid,
	"race_id" uuid,
	"type" varchar(40) NOT NULL,
	"penalty" varchar(100) NOT NULL,
	"reason" text NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "penalties_type_valid" CHECK ("penalties"."type" in ('time_penalty', 'grid_penalty', 'points_deduction', 'disqualification', 'fine', 'reprimand')),
	CONSTRAINT "penalties_penalty_length" CHECK (char_length("penalties"."penalty") >= 2),
	CONSTRAINT "penalties_reason_length" CHECK (char_length("penalties"."reason") between 5 and 255),
	CONSTRAINT "penalties_version_positive" CHECK ("penalties"."version" >= 1),
	CONSTRAINT "penalties_updated_after_created" CHECK ("penalties"."updated_at" >= "penalties"."created_at")
);
--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "penalties_team_id_idx" ON "penalties" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "penalties_driver_id_idx" ON "penalties" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "penalties_race_id_idx" ON "penalties" USING btree ("race_id");--> statement-breakpoint
CREATE INDEX "penalties_issued_at_idx" ON "penalties" USING btree ("issued_at");