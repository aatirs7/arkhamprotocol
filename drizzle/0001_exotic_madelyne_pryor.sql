CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
