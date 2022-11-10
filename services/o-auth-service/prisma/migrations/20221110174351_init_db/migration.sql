-- CreateTable
CREATE TABLE "instagram_access_tokens" (
    "id" VARCHAR(36) NOT NULL,
    "internalUserId" VARCHAR(36) NOT NULL,
    "externalUserId" VARCHAR(36) NOT NULL,
    "scope" VARCHAR(256) NOT NULL,
    "state" VARCHAR(256) NOT NULL,
    "accessToken" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "valid_until" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "instagram_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instagram_access_tokens_internalUserId_key" ON "instagram_access_tokens"("internalUserId");

-- CreateIndex
CREATE UNIQUE INDEX "instagram_access_tokens_externalUserId_key" ON "instagram_access_tokens"("externalUserId");
