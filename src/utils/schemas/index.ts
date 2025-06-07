import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'module.authentication.phoneErrorLength' })
    .max(11, { message: 'module.authentication.phoneErrorLength' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.authentication.phoneErrorFormat',
    }),
  password: z.string().min(6, { message: 'module.authentication.passwordError' }),
});
