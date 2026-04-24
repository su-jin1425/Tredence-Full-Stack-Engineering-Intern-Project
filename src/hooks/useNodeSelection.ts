import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflow-store';

export const useNodeSelection = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const selectNode = useWorkflowStore((state) => state.selectNode);

  return useMemo(
    () => ({
      selectedNodeId,
      selectedNode: nodes.find((node) => node.id === selectedNodeId) ?? null,
      selectNode,
    }),
    [nodes, selectNode, selectedNodeId],
  );
};
