/*
  Warnings:

  - You are about to drop the column `followerId` on the `UserFollowers` table. All the data in the column will be lost.
  - You are about to drop the `UserFollowing` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,relatedUserId]` on the table `UserFollowers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relatedUserId` to the `UserFollowers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserFollowers" DROP CONSTRAINT "UserFollowers_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowing" DROP CONSTRAINT "UserFollowing_followingId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowing" DROP CONSTRAINT "UserFollowing_userId_fkey";

-- AlterTable
ALTER TABLE "UserFollowers" DROP COLUMN "followerId",
ADD COLUMN     "relatedUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserFollowing";

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowers_userId_relatedUserId_key" ON "UserFollowers"("userId", "relatedUserId");

-- AddForeignKey
ALTER TABLE "UserFollowers" ADD CONSTRAINT "UserFollowers_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
