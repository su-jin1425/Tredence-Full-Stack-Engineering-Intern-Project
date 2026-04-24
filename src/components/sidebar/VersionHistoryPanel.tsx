import { Button } from '../common/Button';
import { Panel } from '../common/Panel';
import type { WorkflowVersion } from '../../types/workflow';

type VersionHistoryPanelProps = {
  versions: WorkflowVersion[];
  activeVersionId: string | null;
  onRestore: (versionId: string) => void;
};

export const VersionHistoryPanel = ({ versions, activeVersionId, onRestore }: VersionHistoryPanelProps) => (
  <Panel className="space-y-4">
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Version history</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Restore any saved snapshot without leaving the canvas.</p>
    </div>

    <div className="thin-scrollbar max-h-72 space-y-3 overflow-y-auto pr-1">
      {versions
        .slice()
        .reverse()
        .map((version) => (
          <div
            key={version.id}
            className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{version.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(version.createdAt).toLocaleString()}
                </p>
              </div>
              {activeVersionId === version.id ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              ) : null}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onRestore(version.id)}
              disabled={activeVersionId === version.id}
            >
              Restore
            </Button>
          </div>
        ))}
    </div>
  </Panel>
);
