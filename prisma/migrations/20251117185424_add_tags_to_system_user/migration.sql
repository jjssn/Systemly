-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SystemUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemUser_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SystemUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SystemUser" ("createdAt", "id", "systemId", "userId") SELECT "createdAt", "id", "systemId", "userId" FROM "SystemUser";
DROP TABLE "SystemUser";
ALTER TABLE "new_SystemUser" RENAME TO "SystemUser";
CREATE INDEX "SystemUser_systemId_idx" ON "SystemUser"("systemId");
CREATE INDEX "SystemUser_userId_idx" ON "SystemUser"("userId");
CREATE UNIQUE INDEX "SystemUser_systemId_userId_key" ON "SystemUser"("systemId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
