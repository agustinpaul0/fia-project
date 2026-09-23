CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(60) NOT NULL,
	"code" varchar(10) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_code_unique" UNIQUE("code"),
	CONSTRAINT "categories_name_min_length" CHECK (char_length(btrim("categories"."name")) >= 2),
	CONSTRAINT "categories_code_format" CHECK ("categories"."code" ~ '^[A-Z0-9]{2,10}$'),
	CONSTRAINT "categories_version_positive" CHECK ("categories"."version" >= 1),
	CONSTRAINT "categories_updated_after_created" CHECK ("categories"."updated_at" >= "categories"."created_at")
);
