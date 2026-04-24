import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflow-store';
import { validateWorkflow } from '../utils/validation';

export const useValidation = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const automationActions = useWorkflowStore((state) => state.automationActions);

  return useMemo(() => validateWorkflow(nodes, edges, automationActions), [nodes, edges, automationActions]);
};
