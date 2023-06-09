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
  startDate: z.string().nonempty({
    message: 'Data Inicial é obrigatório'
  }),
  startTime: z.string().nonempty({
    message: 'Hora Inicial é obrigatório'
  }),
  endTime: z.string(),
  endDate: z.string(),
  executorId: z.string({
    invalid_type_error: 'Executante é obrigatório'
  }).uuid(),
  description: z.string(),
  isEnded: z.boolean(),
  materials: z.array(materialSchema),
});

export const serviceOrderSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string().nonempty({
    message: 'Data Inicial é obrigatório'
  }),
  startTime: z.string().nonempty({
    message: 'Hora Inicial é obrigatório'
  }),
  truckId: z.string({
    invalid_type_error: 'Placa é obrigatório'
  }).uuid(),
  driverId: z.string({
    invalid_type_error: 'Motorista é obrigatório'
  }).uuid(),
  odometer: z.number({
    invalid_type_error: 'Kilometros é obrigatório'
  }),
  observation: z.string(),
  services: z.array(serviceSchema).nonempty({
    message: 'Serviços é obrigatório'
  }).refine((services) => (
    services.filter((service) => !service.deleted).length !== 0
  ), {
    message: 'Serviços é obrigatório'
  })
});
