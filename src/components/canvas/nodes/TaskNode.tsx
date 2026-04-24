import type { NodeProps } from '@xyflow/react';
import type { TaskNodeData } from '../../../types/workflow';
import { WorkflowNodeCard } from './WorkflowNodeCard';

export const TaskNode = ({ data, selected }: NodeProps) => {
  const typedData = data as TaskNodeData;

  return (
  <WorkflowNodeCard
    kind="task"
    title={typedData.title}
    subtitle={typedData.assignee ? `Owner: ${typedData.assignee}` : 'Manual action'}
    selected={selected}
    status={typedData.ui?.validationState}
  >
    {typedData.description || 'Add a task description in the config panel.'}
  </WorkflowNodeCard>
  );
};
