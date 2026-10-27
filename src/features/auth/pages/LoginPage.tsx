import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';

import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { Button } from '@/components/ui/Button';
import { Checkbox, FormField, Input, PasswordInput } from '@/components/ui/Field';
import { getRoleHomePath, ROLE_NAMESPACES, ROUTE_PATHS } from '@/constants/routes';
import { HTTP_STATUS } from '@/services/http/httpStatus';
import type { UserRole } from '@/types/roles';

import { useLoginMutation } from '../api/authMutations';

import { AuthCard } from '../components/AuthCard';
import { loginSchema, type LoginFormValues } from '../schemas/login';

import styles from './AuthForm.module.css';

const COPY = {
  title: 'أهلاً بعودتك!',
  subtitle: 'سجّل دخولك لمتابعة رحلة طفلك',
  email: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  forgot: 'نسيت كلمة المرور؟',
  remember: 'تذكّرني على هذا الجهاز',
  submit: 'دخول',
  noAccount: 'ليس لديك حساب؟',
  register: 'سجل الآن',
  invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
} as const;

/** Return to the page the user wanted, but only inside their own role area. */
function resolveDestination(from: unknown, role: UserRole): string {
  const target = typeof from === 'string' ? from : null;
  return target?.startsWith(ROLE_NAMESPACES[role]) ? target : getRoleHomePath(role);
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (session) => {
        const from: unknown = (location.state as { from?: unknown } | null)?.from;
        void navigate(resolveDestination(from, session.user.role), { replace: true });
      },
    });
  });

  const error = loginMutation.error;
  const errorMessage =
    error?.status === HTTP_STATUS.UNAUTHORIZED ? COPY.invalidCredentials : undefined;

  return (
    <AuthCard
      title={COPY.title}
      subtitle={COPY.subtitle}
      footer={
        <>
          {COPY.noAccount}{' '}
          <Link to={ROUTE_PATHS.register} className={styles.inlineLink}>
            {COPY.register}
          </Link>
        </>
      }
    >
      <form className={styles.form} noValidate onSubmit={(event) => void onSubmit(event)}>
        <ApiErrorAlert error={error} message={errorMessage} />
        <FormField label={COPY.email} error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              leadingIcon={<Mail />}
              inputSize="lg"
            />
          )}
        </FormField>
        <FormField
          label={COPY.password}
          error={errors.password?.message}
          labelAction={
            <Link to={ROUTE_PATHS.forgotPassword} className={styles.labelLink}>
              {COPY.forgot}
            </Link>
          }
        >
          {(field) => (
            <PasswordInput
              {...field}
              {...register('password')}
              autoComplete="current-password"
              leadingIcon={<Lock />}
              inputSize="lg"
            />
          )}
        </FormField>
        <Checkbox label={COPY.remember} {...register('rememberMe')} />
        <Button
          type="submit"
          size="lg"
          fullWidth
          className={styles.submit}
          iconStart={<Sparkles aria-hidden="true" />}
          isLoading={loginMutation.isPending}
        >
          {COPY.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
