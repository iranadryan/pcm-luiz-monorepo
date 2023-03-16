import { z } from 'zod';
import {
  createInputSchemaValidation,
  serviceOrderOutputSchemaValidation,
} from './routers/schemasValidation/serviceOrder';

export type ServiceOrder = z.infer<typeof serviceOrderOutputSchemaValidation>;

export type ServiceOrderFormData = z.infer<typeof createInputSchemaValidation>;
