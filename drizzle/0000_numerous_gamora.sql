CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_day" integer NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"month" varchar(7) NOT NULL,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
