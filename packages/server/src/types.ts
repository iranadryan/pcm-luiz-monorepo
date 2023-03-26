import { z } from 'zod';
import {
  createInputSchemaValidation,
  updateInputSchemaValidation,
  serviceOrderOutputSchemaValidation,
} from './routers/schemasValidation/serviceOrder';

export type ServiceOrder = z.infer<typeof serviceOrderOutputSchemaValidation>;

export type ServiceOrderFormData = z.infer<typeof createInputSchemaValidation>;

export type ServiceOrderUpdateFormData = z.infer<
  typeof updateInputSchemaValidation
>;
