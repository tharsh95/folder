-- CreateTable
CREATE TABLE "public"."file_nodes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isFolder" BOOLEAN NOT NULL,
    "content" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_nodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."file_nodes" ADD CONSTRAINT "file_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."file_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
