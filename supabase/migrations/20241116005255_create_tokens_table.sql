CREATE TABLE "public"."tokens" (
  "token" text,
  "user_id" UUID NOT NULL DEFAULT gen_random_uuid ()
);

ALTER TABLE "public"."tokens" enable ROW level security;

CREATE UNIQUE INDEX channels_user_id_key ON public.channels USING btree (user_id);

CREATE UNIQUE INDEX tokens_pkey ON public.tokens USING btree (user_id);

CREATE UNIQUE INDEX tokens_user_id_key ON public.tokens USING btree (user_id);

ALTER TABLE "public"."tokens"
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY USING index "tokens_pkey";

ALTER TABLE "public"."channels"
ADD CONSTRAINT "channels_user_id_key" UNIQUE USING index "channels_user_id_key";

ALTER TABLE "public"."tokens"
ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) NOT valid;

ALTER TABLE "public"."tokens" validate CONSTRAINT "tokens_user_id_fkey";

ALTER TABLE "public"."tokens"
ADD CONSTRAINT "tokens_user_id_key" UNIQUE USING index "tokens_user_id_key";

GRANT delete ON TABLE "public"."tokens" TO "anon";

GRANT insert ON TABLE "public"."tokens" TO "anon";

GRANT REFERENCES ON TABLE "public"."tokens" TO "anon";

GRANT
SELECT
  ON TABLE "public"."tokens" TO "anon";

GRANT trigger ON TABLE "public"."tokens" TO "anon";

GRANT
TRUNCATE ON TABLE "public"."tokens" TO "anon";

GRANT
UPDATE ON TABLE "public"."tokens" TO "anon";

GRANT delete ON TABLE "public"."tokens" TO "authenticated";

GRANT insert ON TABLE "public"."tokens" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."tokens" TO "authenticated";

GRANT
SELECT
  ON TABLE "public"."tokens" TO "authenticated";

GRANT trigger ON TABLE "public"."tokens" TO "authenticated";

GRANT
TRUNCATE ON TABLE "public"."tokens" TO "authenticated";

GRANT
UPDATE ON TABLE "public"."tokens" TO "authenticated";

GRANT delete ON TABLE "public"."tokens" TO "service_role";

GRANT insert ON TABLE "public"."tokens" TO "service_role";

GRANT REFERENCES ON TABLE "public"."tokens" TO "service_role";

GRANT
SELECT
  ON TABLE "public"."tokens" TO "service_role";

GRANT trigger ON TABLE "public"."tokens" TO "service_role";

GRANT
TRUNCATE ON TABLE "public"."tokens" TO "service_role";

GRANT
UPDATE ON TABLE "public"."tokens" TO "service_role";

CREATE POLICY "Enable insert for users based on user_id" ON "public"."tokens" AS permissive FOR insert TO public
WITH
  CHECK (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  );

CREATE POLICY "Enable select for users based on user_id" ON "public"."tokens" AS permissive FOR
SELECT
  TO public USING (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  );

CREATE POLICY "Enable update for users based on user_id" ON "public"."tokens" AS permissive
FOR UPDATE
  TO public USING (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  )
WITH
  CHECK (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  );
