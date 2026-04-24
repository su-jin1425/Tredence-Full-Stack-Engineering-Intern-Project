import type { ValidationResult } from '../../types/workflow';

type ValidationSummaryProps = {
  validation: ValidationResult;
};

export const ValidationSummary = ({ validation }: ValidationSummaryProps) => (
  <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Validation</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {validation.isValid ? 'Ready' : 'Attention'}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {validation.issues.length
          ? `${validation.issues.length} issue(s) must be reviewed before simulation.`
          : 'Workflow satisfies the current graph and field rules.'}
      </p>
    </div>

    <div className="thin-scrollbar max-h-40 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      {validation.issues.length ? (
        validation.issues.map((issue, index) => (
          <div
            key={`${issue.code}_${issue.nodeId ?? 'global'}_${index}`}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
          >
            {issue.message}
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          Workflow graph is valid and ready to run.
        </div>
      )}
    </div>
  </div>
);
