-- CreateTable
CREATE TABLE "ProblemDetail" (
    "id" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "starterCode" JSONB NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemDetail_problemId_key" ON "ProblemDetail"("problemId");

-- AddForeignKey
ALTER TABLE "ProblemDetail" ADD CONSTRAINT "ProblemDetail_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
