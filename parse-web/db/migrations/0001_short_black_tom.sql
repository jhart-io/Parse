CREATE TYPE "public"."login_method" AS ENUM('password');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"login_method" "login_method" DEFAULT 'password' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "persons" ADD COLUMN "account_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_account_id_unique" UNIQUE("account_id");