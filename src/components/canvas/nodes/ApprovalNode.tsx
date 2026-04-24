import type { NodeProps } from '@xyflow/react';
import type { ApprovalNodeData } from '../../../types/workflow';
import { WorkflowNodeCard } from './WorkflowNodeCard';

export const ApprovalNode = ({ data, selected }: NodeProps) => {
  const typedData = data as ApprovalNodeData;

  return (
  <WorkflowNodeCard
    kind="approval"
    title={typedData.title}
    subtitle={typedData.approverRole ? `${typedData.approverRole}` : 'Approval gate'}
    selected={selected}
    status={typedData.ui?.validationState}
  >
    Threshold: {typedData.threshold}
  </WorkflowNodeCard>
  );
};
