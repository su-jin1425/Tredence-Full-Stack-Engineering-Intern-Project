import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflow-store';

export const useWorkflow = () => {
  const store = useWorkflowStore();

  return useMemo(
    () => ({
      ...store,
      canUndo: store.past.length > 0,
      canRedo: store.future.length > 0,
    }),
    [store],
  );
};
