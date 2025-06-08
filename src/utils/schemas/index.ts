import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'module.authentication.phoneErrorLength' })
    .max(11, { message: 'module.authentication.phoneErrorLength' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.authentication.phoneErrorFormat',
    }),
  password: z
    .string()
    .min(6, { message: 'module.authentication.passwordError' })
    .max(32, { message: 'module.authentication.passwordError' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
      message: 'module.authentication.passwordComplexityError',
    }),
});

export const createQRSchema = z.object({
  area: z.string().min(1, { message: 'module.qrManagement.areaError' }),
  table: z.string().min(1, { message: 'module.qrManagement.tableError' }),
});

export const createAreaSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addAreaField.fieldNameError' }),
  description: z.string().optional(),
});

export const createTableSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldNameError' }),
  areaId: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldAreaIdError' }),
  description: z.string().optional(),
});

export const createAdditionalFieldSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldNameError' }),
  value: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldValueError' }),
});
