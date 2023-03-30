-- DropForeignKey
ALTER TABLE "service_orders_services" DROP CONSTRAINT "service_orders_services_serviceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "service_orders_services_materials" DROP CONSTRAINT "service_orders_services_materials_serviceOrderServiceId_fkey";

-- AddForeignKey
ALTER TABLE "service_orders_services" ADD CONSTRAINT "service_orders_services_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders_services_materials" ADD CONSTRAINT "service_orders_services_materials_serviceOrderServiceId_fkey" FOREIGN KEY ("serviceOrderServiceId") REFERENCES "service_orders_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
