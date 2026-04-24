import type { NodeProps } from '@xyflow/react';
import type { StartNodeData } from '../../../types/workflow';
import { WorkflowNodeCard } from './WorkflowNodeCard';

export const StartNode = ({ data, selected }: NodeProps) => {
  const typedData = data as StartNodeData;

  return (
  <WorkflowNodeCard
    kind="start"
    title={typedData.title}
    subtitle={typedData.metadata.filter((item) => item.key && item.value).length ? 'Metadata configured' : 'Entry point'}
    selected={selected}
    status={typedData.ui?.validationState}
    hideTarget
  >
    Begins the workflow execution path.
  </WorkflowNodeCard>
  );
};
