-- CreateEnum
CREATE TYPE "user_role_enum" AS ENUM ('influencer', 'user', 'admin', 'agencyUser', 'agencyAdmin');

-- CreateEnum
CREATE TYPE "TokenTypeEnum" AS ENUM ('EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "first_name" VARCHAR(256) NOT NULL,
    "last_name" VARCHAR(256) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "role" "user_role_enum" NOT NULL DEFAULT 'user',
    "avatar_image_url" VARCHAR(512) NOT NULL DEFAULT 'https://gravatar.com/avatar/2f7946d618d282ce59f3eda2d1359d0e?s=400&d=robohash&r=x',
    "welcome_experience_shown" BOOLEAN NOT NULL DEFAULT false,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paid_plan_types" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(256) NOT NULL,
    "detail" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "paid_plan_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_on_paid_plans" (
    "id" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "paidPlanTypeId" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "valid_until_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_on_paid_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_on_paid_plans" ADD CONSTRAINT "user_on_paid_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_on_paid_plans" ADD CONSTRAINT "user_on_paid_plans_paidPlanTypeId_fkey" FOREIGN KEY ("paidPlanTypeId") REFERENCES "paid_plan_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
