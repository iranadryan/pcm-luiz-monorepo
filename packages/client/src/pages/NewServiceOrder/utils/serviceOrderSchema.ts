import { z } from 'zod';

const materialSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

const serviceSchema = z.object({
  id: z.string().uuid(),
  serviceId: z.string().uuid(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  endDate: z.string(),
  executorId: z.string().uuid(),
  materials: z.array(materialSchema),
});

export const serviceOrderSchema = z.object({
  startDate: z.string(),
  startTime: z.string(),
  truckId: z.string().uuid(),
  driverId: z.string().uuid(),
  odometer: z.number(),
  observation: z.string(),
  services: z.array(serviceSchema)
});
