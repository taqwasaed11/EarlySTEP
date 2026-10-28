import { z } from 'zod';

import { emailField } from './fields';
import { AUTH_MESSAGES } from './messages';

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, AUTH_MESSAGES.passwordRequired),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
