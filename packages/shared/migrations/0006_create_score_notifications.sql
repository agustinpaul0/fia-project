CREATE TABLE "score_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"race_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"results_revision" integer NOT NULL,
	"confirmed_at" timestamp with time zone,
	"confirmed_by_user_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "score_notifications_race_team_revision_unique" UNIQUE("race_id","team_id","results_revision"),
	CONSTRAINT "score_notifications_revision_positive" CHECK ("score_notifications"."results_revision" >= 1),
	CONSTRAINT "score_notifications_confirmation_complete" CHECK (("score_notifications"."confirmed_at" is null) = ("score_notifications"."confirmed_by_user_id" is null)),
	CONSTRAINT "score_notifications_version_positive" CHECK ("score_notifications"."version" >= 1),
	CONSTRAINT "score_notifications_updated_after_created" CHECK ("score_notifications"."updated_at" >= "score_notifications"."created_at")
);
--> statement-breakpoint
ALTER TABLE "score_notifications" ADD CONSTRAINT "score_notifications_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_notifications" ADD CONSTRAINT "score_notifications_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_notifications" ADD CONSTRAINT "score_notifications_confirmed_by_user_id_user_id_fk" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;