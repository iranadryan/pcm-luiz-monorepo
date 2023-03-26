import { z } from 'zod';

const materialSchema = z.object({
  id: z.string().uuid(),
  alreadyExists: z.boolean(),
  deleted: z.boolean(),
  materialId: z.string().uuid(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

const serviceSchema = z.object({
  id: z.string().uuid(),
  alreadyExists: z.boolean(),
  deleted: z.boolean(),
  serviceId: z.string().uuid(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string().nonempty(),
  endDate: z.string(),
  executorId: z.string().uuid(),
  description: z.string(),
  materials: z.array(materialSchema),
});

export const serviceOrderSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string(),
  startTime: z.string(),
  truckId: z.string().uuid(),
  driverId: z.string().uuid(),
  odometer: z.number(),
  observation: z.string(),
  services: z.array(serviceSchema).nonempty()
});
