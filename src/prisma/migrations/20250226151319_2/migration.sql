/*
  Warnings:

  - Added the required column `email` to the `Host` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Host` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Host` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "aboutMe" TEXT,
    "name" TEXT
);
INSERT INTO "new_Host" ("id", "name", "username") SELECT "id", "name", "username" FROM "Host";
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE UNIQUE INDEX "Host_username_key" ON "Host"("username");
CREATE UNIQUE INDEX "Host_email_key" ON "Host"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
