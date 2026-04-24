import clsx from 'clsx';
import { Handle, Position } from '@xyflow/react';
import type { PropsWithChildren } from 'react';
import type { ValidationState, WorkflowNodeKind } from '../../../types/workflow';
import { getNodeAccent } from '../../../utils/workflow';

type WorkflowNodeCardProps = PropsWithChildren<{
  kind: WorkflowNodeKind;
  title: string;
  subtitle: string;
  selected: boolean;
  status?: ValidationState;
  hideTarget?: boolean;
  hideSource?: boolean;
}>;

const STATUS_STYLES: Record<ValidationState, string> = {
  valid: 'bg-emerald-500',
  invalid: 'bg-rose-500',
  warning: 'bg-amber-500',
};

export const WorkflowNodeCard = ({
  kind,
  title,
  subtitle,
  selected,
  status = 'valid',
  hideSource = false,
  hideTarget = false,
  children,
}: WorkflowNodeCardProps) => (
  <div
    className={clsx(
      'min-w-[210px] rounded-[24px] border border-white/50 bg-white/90 p-4 shadow-panel backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-950/85',
      selected && 'ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950',
    )}
  >
    {!hideTarget ? <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" /> : null}
    {!hideSource ? <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-white !bg-slate-500" /> : null}

    <div className="flex items-start gap-3">
      <div className={clsx('h-11 w-11 rounded-2xl bg-gradient-to-br', getNodeAccent(kind))} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <span className={clsx('h-2.5 w-2.5 rounded-full', STATUS_STYLES[status])} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>

    {children ? <div className="mt-3 rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">{children}</div> : null}
  </div>
);
