import clsx from 'clsx';
import type { HTMLAttributes, PropsWithChildren } from 'react';

type PanelProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
  }
>;

export const Panel = ({ children, className, inset = false, ...props }: PanelProps) => (
  <div className={clsx('app-panel', inset ? 'p-4' : 'p-5', className)} {...props}>
    {children}
  </div>
);
