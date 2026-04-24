import { useNodeSelection } from '../../hooks/useNodeSelection';
import { useWorkflowStore } from '../../store/workflow-store';
import type { ApprovalNodeData, AutomatedNodeData, EndNodeData, StartNodeData, TaskNodeData } from '../../types/workflow';
import { Panel } from '../common/Panel';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';

export const NodeConfigPanel = () => {
  const { selectedNode } = useNodeSelection();
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const automationActions = useWorkflowStore((state) => state.automationActions);

  if (!selectedNode) {
    return (
      <Panel className="flex h-full items-center justify-center text-center">
        <div className="max-w-xs">
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">Node configuration</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Select a node on the canvas to edit its properties, required fields, and workflow metadata.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="thin-scrollbar h-full overflow-y-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {selectedNode.type} node
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Configuration</p>
      </div>

      {(() => {
        switch (selectedNode.type) {
          case 'start':
            return (
              <StartNodeForm
                data={selectedNode.data as StartNodeData}
                onSave={(data) => updateNodeData(selectedNode.id, data)}
              />
            );
          case 'task':
            return (
              <TaskNodeForm data={selectedNode.data as TaskNodeData} onSave={(data) => updateNodeData(selectedNode.id, data)} />
            );
          case 'approval':
            return (
              <ApprovalNodeForm
                data={selectedNode.data as ApprovalNodeData}
                onSave={(data) => updateNodeData(selectedNode.id, data)}
              />
            );
          case 'automated':
            return (
              <AutomatedNodeForm
                data={selectedNode.data as AutomatedNodeData}
                actions={automationActions}
                onSave={(data) => updateNodeData(selectedNode.id, data)}
              />
            );
          case 'end':
            return (
              <EndNodeForm data={selectedNode.data as EndNodeData} onSave={(data) => updateNodeData(selectedNode.id, data)} />
            );
          default:
            return null;
        }
      })()}
    </Panel>
  );
};
