import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { BrandMark } from '@/components/layout/BrandMark';
import { ROUTE_PATHS } from '@/constants/routes';
import { cx } from '@/utils/classNames';

import styles from './AuthCard.module.css';

const LABELS = {
  backHome: 'العودة للرئيسية',
  home: 'الصفحة الرئيسية',
} as const;

export interface AuthCardProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'default' | 'wide';
}

/** Replit auth card: back link, centred brand, title, subtitle, form, footer link. */
export function AuthCard({ title, subtitle, children, footer, size = 'default' }: AuthCardProps) {
  return (
    <div className={cx(styles.wrapper, size === 'wide' && styles.wide)}>
      <Link to={ROUTE_PATHS.home} className={styles.backLink}>
        <ArrowRight aria-hidden="true" />
        {LABELS.backHome}
      </Link>
      <section className={styles.card} aria-labelledby="auth-title">
        <div className={styles.brand}>
          <Link to={ROUTE_PATHS.home} className={styles.brandLink} aria-label={LABELS.home}>
            <BrandMark size="lg" />
          </Link>
        </div>
        <header className={styles.header}>
          <h1 id="auth-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </section>
    </div>
  );
}
