/*
  Warnings:

  - Added the required column `description` to the `ProblemDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProblemDetail" ADD COLUMN     "description" TEXT NOT NULL;
