CREATE TYPE "public"."race_type" AS ENUM('grand_prix', 'sprint');--> statement-breakpoint
ALTER TABLE "races" DROP CONSTRAINT "races_season_category_round_unique";--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "type" "race_type" DEFAULT 'grand_prix' NOT NULL;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "results_revision" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_season_category_round_type_unique" UNIQUE("season_id","category_id","round","type");--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_points_max" CHECK ("race_results"."points" <= 25);--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_results_revision_non_negative" CHECK ("races"."results_revision" >= 0);