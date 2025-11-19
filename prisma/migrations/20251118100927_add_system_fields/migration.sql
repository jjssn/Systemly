-- CreateTable
CREATE TABLE "SystemField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'text',
    "options" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SystemField_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SystemField_systemId_idx" ON "SystemField"("systemId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemField_systemId_name_key" ON "SystemField"("systemId", "name");
