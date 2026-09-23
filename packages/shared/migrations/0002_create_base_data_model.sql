CREATE TABLE "circuits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"country" varchar(60) NOT NULL,
	"city" varchar(60) NOT NULL,
	"length_km" numeric(5, 3) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "circuits_name_unique" UNIQUE("name"),
	CONSTRAINT "circuits_length_positive" CHECK ("circuits"."length_km" > 0),
	CONSTRAINT "circuits_version_positive" CHECK ("circuits"."version" >= 1),
	CONSTRAINT "circuits_updated_after_created" CHECK ("circuits"."updated_at" >= "circuits"."created_at")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(60) NOT NULL,
	"last_name" varchar(60) NOT NULL,
	"code" varchar(3) NOT NULL,
	"number" integer NOT NULL,
	"country" varchar(60) NOT NULL,
	"team_id" uuid,
	"role" varchar(20) DEFAULT 'main' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drivers_code_unique" UNIQUE("code"),
	CONSTRAINT "drivers_number_unique" UNIQUE("number"),
	CONSTRAINT "drivers_code_format" CHECK ("drivers"."code" ~ '^[A-Z]{3}$'),
	CONSTRAINT "drivers_number_range" CHECK ("drivers"."number" >= 1 and "drivers"."number" <= 99),
	CONSTRAINT "drivers_role_valid" CHECK ("drivers"."role" in ('main', 'reserve')),
	CONSTRAINT "drivers_version_positive" CHECK ("drivers"."version" >= 1),
	CONSTRAINT "drivers_updated_after_created" CHECK ("drivers"."updated_at" >= "drivers"."created_at")
);
--> statement-breakpoint
CREATE TABLE "race_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"race_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "race_results_race_position_unique" UNIQUE("race_id","position"),
	CONSTRAINT "race_results_race_driver_unique" UNIQUE("race_id","driver_id"),
	CONSTRAINT "race_results_position_positive" CHECK ("race_results"."position" >= 1),
	CONSTRAINT "race_results_points_non_negative" CHECK ("race_results"."points" >= 0),
	CONSTRAINT "race_results_version_positive" CHECK ("race_results"."version" >= 1),
	CONSTRAINT "race_results_updated_after_created" CHECK ("race_results"."updated_at" >= "race_results"."created_at")
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"circuit_id" uuid NOT NULL,
	"round" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "races_season_category_round_unique" UNIQUE("season_id","category_id","round"),
	CONSTRAINT "races_round_positive" CHECK ("races"."round" >= 1),
	CONSTRAINT "races_version_positive" CHECK ("races"."version" >= 1),
	CONSTRAINT "races_updated_after_created" CHECK ("races"."updated_at" >= "races"."created_at")
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"name" varchar(60) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seasons_year_unique" UNIQUE("year"),
	CONSTRAINT "seasons_year_range" CHECK ("seasons"."year" >= 1950 and "seasons"."year" <= 2100),
	CONSTRAINT "seasons_version_positive" CHECK ("seasons"."version" >= 1),
	CONSTRAINT "seasons_updated_after_created" CHECK ("seasons"."updated_at" >= "seasons"."created_at")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"country" varchar(60) NOT NULL,
	"category_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_name_unique" UNIQUE("name"),
	CONSTRAINT "teams_version_positive" CHECK ("teams"."version" >= 1),
	CONSTRAINT "teams_updated_after_created" CHECK ("teams"."updated_at" >= "teams"."created_at")
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_results" ADD CONSTRAINT "race_results_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_circuit_id_circuits_id_fk" FOREIGN KEY ("circuit_id") REFERENCES "public"."circuits"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;