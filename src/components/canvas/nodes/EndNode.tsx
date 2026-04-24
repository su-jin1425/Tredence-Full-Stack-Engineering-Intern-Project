import type { NodeProps } from '@xyflow/react';
import type { EndNodeData } from '../../../types/workflow';
import { WorkflowNodeCard } from './WorkflowNodeCard';

export const EndNode = ({ data, selected }: NodeProps) => {
  const typedData = data as EndNodeData;

  return (
  <WorkflowNodeCard
    kind="end"
    title="End"
    subtitle={typedData.summary ? 'Summary visible' : 'Summary hidden'}
    selected={selected}
    status={typedData.ui?.validationState}
    hideSource
  >
    {typedData.endMessage}
  </WorkflowNodeCard>
  );
};
