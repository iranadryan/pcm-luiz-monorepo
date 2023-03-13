import { z } from 'zod';
import { serviceOrderOutputSchemaValidation } from './routers/schemasValidation/serviceOrder';

export type ServiceOrder = z.infer<typeof serviceOrderOutputSchemaValidation>;
