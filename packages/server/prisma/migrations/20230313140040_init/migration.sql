-- CreateEnum
CREATE TYPE "TruckType" AS ENUM ('TRACTOR_UNIT', 'SEMI_TRAILER');

-- CreateEnum
CREATE TYPE "PersonRole" AS ENUM ('DRIVER', 'MECHANIC');

-- CreateEnum
CREATE TYPE "ServiceOrderStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "trucks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "type" "TruckType" NOT NULL,

    CONSTRAINT "trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "code" INTEGER,
    "name" TEXT NOT NULL,
    "role" "PersonRole" NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders" (
    "id" TEXT NOT NULL,
    "number" INTEGER,
    "truckId" TEXT NOT NULL,
    "odometer" INTEGER NOT NULL,
    "driverId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endDate" DATE,
    "endTime" TIME,
    "observation" TEXT,
    "status" "ServiceOrderStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders_services" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "executorId" TEXT NOT NULL,
    "startTime" TIME NOT NULL,
    "endDate" DATE NOT NULL,
    "endTime" TIME NOT NULL,
    "serviceOrderId" TEXT NOT NULL,

    CONSTRAINT "service_orders_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders_services_materials" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "serviceOrderServiceId" TEXT NOT NULL,

    CONSTRAINT "service_orders_services_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trucks_plate_key" ON "trucks"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "people_code_key" ON "people"("code");

-- CreateIndex
CREATE UNIQUE INDEX "services_code_key" ON "services"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services" ADD CONSTRAINT "service_orders_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services" ADD CONSTRAINT "service_orders_services_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services" ADD CONSTRAINT "service_orders_services_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services_materials" ADD CONSTRAINT "service_orders_services_materials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services_materials" ADD CONSTRAINT "service_orders_services_materials_serviceOrderServiceId_fkey" FOREIGN KEY ("serviceOrderServiceId") REFERENCES "service_orders_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
