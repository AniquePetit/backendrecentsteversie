/*
  Warnings:

  - Added the required column `password` to the `Host` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Host` table without a default value. This is not possible if the table is not empty.
*/

-- AlterTable: Booking tabel
ALTER TABLE "Booking" ADD COLUMN "bookingStatus" TEXT;
ALTER TABLE "Booking" ADD COLUMN "numberOfGuests" INTEGER;

-- AlterTable: Property tabel
ALTER TABLE "Property" ADD COLUMN "bathRoomCount" INTEGER;
ALTER TABLE "Property" ADD COLUMN "bedroomCount" INTEGER;
ALTER TABLE "Property" ADD COLUMN "description" TEXT;
ALTER TABLE "Property" ADD COLUMN "maxGuestCount" INTEGER;
ALTER TABLE "Property" ADD COLUMN "rating" INTEGER;

-- AlterTable: User tabel
ALTER TABLE "User" ADD COLUMN "name" TEXT;
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "profilePicture" TEXT;

-- RedefineTables: Host tabel (met password en username)
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Maak een nieuwe tijdelijke "new_Host" tabel met standaardwaarden voor `password` en `username`
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL DEFAULT '',  -- Voeg een tijdelijke lege string toe voor de `username` kolom
    "password" TEXT NOT NULL DEFAULT '',  -- Voeg een tijdelijke lege string toe voor de `password` kolom
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePicture" TEXT,
    "aboutMe" TEXT
);

-- Kopieer de bestaande data van de oude "Host" tabel naar de nieuwe tabel
INSERT INTO "new_Host" ("email", "id", "name") 
SELECT "email", "id", "name" FROM "Host";

-- Verwijder de oude "Host" tabel
DROP TABLE "Host";

-- Hernoem de tijdelijke "new_Host" tabel naar "Host"
ALTER TABLE "new_Host" RENAME TO "Host";

-- Voeg unieke indexen toe op `username` en `email`
CREATE UNIQUE INDEX "Host_username_key" ON "Host"("username");
CREATE UNIQUE INDEX "Host_email_key" ON "Host"("email");

-- Zet foreign keys weer aan
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
