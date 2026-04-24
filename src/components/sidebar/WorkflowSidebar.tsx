import type { DragEvent } from 'react';
import { SIDEBAR_NODE_ORDER } from '../../utils/constants';
import { WORKFLOW_TEMPLATES } from '../../utils/workflow';
import { Button } from '../common/Button';
import { Panel } from '../common/Panel';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import type { WorkflowNodeKind, WorkflowVersion } from '../../types/workflow';

type WorkflowSidebarProps = {
  onLoadTemplate: (templateId: string) => void;
  versions: WorkflowVersion[];
  activeVersionId: string | null;
  onRestoreVersion: (versionId: string) => void;
};

const NODE_DESCRIPTIONS: Record<WorkflowNodeKind, string> = {
  start: 'Workflow entry point',
  task: 'Human-driven action',
  approval: 'Role-based decision gate',
  automated: 'Mock API automation step',
  end: 'Workflow completion point',
};

export const WorkflowSidebar = ({
  onLoadTemplate,
  versions,
  activeVersionId,
  onRestoreVersion,
}: WorkflowSidebarProps) => {
  const handleDragStart = (event: DragEvent<HTMLButtonElement>, kind: WorkflowNodeKind) => {
    event.dataTransfer.setData('application/reactflow', kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="thin-scrollbar flex h-full flex-col gap-4 overflow-y-auto px-4 pb-4">
      <Panel className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Node library</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Drag nodes onto the canvas to compose a workflow.</p>
        </div>

        <div className="space-y-3">
          {SIDEBAR_NODE_ORDER.map((kind) => (
            <button
              key={kind}
              type="button"
              draggable
              onDragStart={(event) => handleDragStart(event, kind)}
              className="w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-brand-500"
            >
              <p className="font-semibold capitalize text-slate-900 dark:text-slate-100">{kind}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{NODE_DESCRIPTIONS[kind]}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Templates</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Start from realistic HR flow blueprints.</p>
        </div>

        <div className="space-y-3">
          {WORKFLOW_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{template.description}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => onLoadTemplate(template.id)}
              >
                Load template
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <VersionHistoryPanel
        versions={versions}
        activeVersionId={activeVersionId}
        onRestore={onRestoreVersion}
      />
    </aside>
  );
};
