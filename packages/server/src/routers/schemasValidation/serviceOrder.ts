import { z } from 'zod';

export const serviceOrderOutputSchemaValidation = z.object({
  id: z.string(),
  number: z.number().nullable(),
  status: z.enum(['OPEN', 'CLOSED']),
  startDate: z.date(),
  endDate: z.date().nullable(),
  truck: z.object({
    plate: z.string(),
  }),
  driver: z.object({
    name: z.string(),
  }),
});

export const listOutputSchemaValidation = z.array(
  serviceOrderOutputSchemaValidation
);

export const createInputSchemaValidation = z.object({
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a date'
  }),

  startTime: z.date({
    required_error: 'Start time is required',
    invalid_type_error: 'Start time must be a date'
  }),

  truckId: z.string({
    required_error: 'Truck ID is required',
    invalid_type_error: 'Truck ID must be a string'
  }).uuid({
    message: 'Truck ID must be a uuid'
  }),

  driverId: z.string({
    required_error: 'Driver ID is required',
    invalid_type_error: 'Driver ID must be a string'
  }).uuid({
    message: 'Driver ID must be a uuid'
  }),

  odometer: z.number({
    required_error: 'Odometer is required',
    invalid_type_error: 'Odometer must be a number'
  }),

  observation: z.string({
    invalid_type_error: 'Observation must be a string'
  }).optional(),

  services: z.array(z.object({
    serviceId: z.string({
      required_error: 'Service ID is required',
      invalid_type_error: 'Service ID must be a string'
    }).uuid({
      message: 'Service ID must be a uuid'
    }),

    executorId: z.string({
      required_error: 'Executor ID is required',
      invalid_type_error: 'Executor ID must be a string'
    }).uuid({
      message: 'Executor ID must be a uuid'
    }),

    startTime: z.date({
      required_error: 'Start time is required',
      invalid_type_error: 'Start time must be a date'
    }),

    endDate: z.date({
      required_error: 'End date is required',
      invalid_type_error: 'End date must be a date'
    }),

    endTime: z.date({
      required_error: 'End time is required',
      invalid_type_error: 'End time must be a date'
    }),

    materials: z.array(z.object({
      materialId: z.string({
        required_error: 'Material ID is required',
        invalid_type_error: 'Material ID must be a string'
      }).uuid({
        message: 'Material ID must be a uuid'
      }),

      quantity: z.number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number'
      })
    }, {
      required_error: 'Material body is required',
    }), {
      required_error: 'Materials are required',
      invalid_type_error: 'Materials must be an array',
    }),
  }, {
    required_error: 'Service body is required'
  }), {
    required_error: 'Services are required',
    invalid_type_error: 'Services must be an array'
  })
}, {
  required_error: 'Service order body is required'
});

export const closeInputSchemaValidation = z.object({
  id: z.string({
    required_error: 'Service order ID is required',
    invalid_type_error: 'Service order ID must be a string',
  }).uuid({
    message: 'Service order ID must be a uuid',
  }),

  number: z.number({
    required_error: 'Service order number is required',
    invalid_type_error: 'Service order number must be a number'
  }),

  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a date'
  }),

  endTime: z.date({
    required_error: 'End time is required',
    invalid_type_error: 'End time must be a date'
  }),
});
