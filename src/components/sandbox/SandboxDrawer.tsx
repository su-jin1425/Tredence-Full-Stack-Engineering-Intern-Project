import clsx from 'clsx';
import type { SimulationLog, ValidationResult } from '../../types/workflow';
import { Button } from '../common/Button';
import { ValidationSummary } from './ValidationSummary';

type SandboxDrawerProps = {
  isOpen: boolean;
  logs: SimulationLog[];
  isRunning: boolean;
  error: string | null;
  validation: ValidationResult;
  onRun: () => void;
  onToggle: () => void;
};

export const SandboxDrawer = ({
  isOpen,
  logs,
  isRunning,
  error,
  validation,
  onRun,
  onToggle,
}: SandboxDrawerProps) => (
  <section
    className={clsx(
      'app-panel mx-4 mb-4 flex flex-col overflow-hidden transition-[height] duration-300',
      isOpen ? 'h-[320px]' : 'h-[84px]',
    )}
  >
    <div className="flex items-center justify-between border-b border-white/50 px-5 py-4 dark:border-slate-800">
      <div>
        <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">Sandbox Panel</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Validate the graph, simulate the workflow, and inspect execution logs.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onToggle}>
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Workflow'}
        </Button>
      </div>
    </div>

    <div className="grid h-full gap-4 overflow-hidden px-5 py-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="overflow-hidden">
        <ValidationSummary validation={validation} />
        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Execution logs</p>
        </div>

        <div className="thin-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
          {logs.length ? (
            logs.map((log) => (
              <div key={log.id} className="relative pl-6">
                <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Step {log.step} • {log.status}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{log.message}</p>
                <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
              Run a simulation to inspect the generated execution timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);
