import type { NodeProps } from '@xyflow/react';
import type { AutomatedNodeData } from '../../../types/workflow';
import { WorkflowNodeCard } from './WorkflowNodeCard';

export const AutomatedNode = ({ data, selected }: NodeProps) => {
  const typedData = data as AutomatedNodeData;

  return (
  <WorkflowNodeCard
    kind="automated"
    title={typedData.title}
    subtitle={typedData.actionLabel || 'Select an automation'}
    selected={selected}
    status={typedData.ui?.validationState}
  >
    {Object.keys(typedData.params).length ? `${Object.keys(typedData.params).length} parameter(s) configured` : 'No parameters set'}
  </WorkflowNodeCard>
  );
};
