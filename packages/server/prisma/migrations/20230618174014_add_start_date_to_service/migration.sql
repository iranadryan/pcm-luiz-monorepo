-- AlterTable
ALTER TABLE "service_orders_services" ADD COLUMN     "startDate" DATE,
ALTER COLUMN "startTime" DROP NOT NULL;
