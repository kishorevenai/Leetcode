/*
  Warnings:

  - Changed the type of `constraints` on the `ProblemDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ProblemDetail" DROP COLUMN "constraints",
ADD COLUMN     "constraints" JSONB NOT NULL;
