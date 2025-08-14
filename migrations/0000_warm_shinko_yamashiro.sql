CREATE TABLE "edl_events" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"event_type" text NOT NULL,
	"clip_id" text NOT NULL,
	"clip_title" text NOT NULL,
	"timecode" text NOT NULL,
	"trim_in" text NOT NULL,
	"trim_out" text NOT NULL,
	"parameters" json,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edl_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"total_duration" text,
	"venue" text,
	"description" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metadata_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"metadata" json NOT NULL,
	"files" json NOT NULL,
	"selected_file" json NOT NULL,
	"stream_url" text NOT NULL,
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed" timestamp DEFAULT now(),
	CONSTRAINT "metadata_cache_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "search_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"query_hash" text NOT NULL,
	"query" text NOT NULL,
	"filters" json NOT NULL,
	"results" json NOT NULL,
	"total_results" integer NOT NULL,
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"hit_count" integer DEFAULT 1 NOT NULL,
	"last_accessed" timestamp DEFAULT now(),
	CONSTRAINT "search_cache_query_hash_unique" UNIQUE("query_hash")
);
--> statement-breakpoint
ALTER TABLE "edl_events" ADD CONSTRAINT "edl_events_session_id_edl_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."edl_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "edl_events_session_id_idx" ON "edl_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "edl_events_timestamp_idx" ON "edl_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "edl_events_event_type_idx" ON "edl_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "edl_sessions_name_idx" ON "edl_sessions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "edl_sessions_start_time_idx" ON "edl_sessions" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "metadata_cache_identifier_idx" ON "metadata_cache" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "metadata_cache_expires_at_idx" ON "metadata_cache" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "search_cache_query_hash_idx" ON "search_cache" USING btree ("query_hash");--> statement-breakpoint
CREATE INDEX "search_cache_expires_at_idx" ON "search_cache" USING btree ("expires_at");