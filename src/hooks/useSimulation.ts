import { useCallback } from 'react';
import { simulateWorkflow } from '../api/mockApi';
import { useWorkflowStore } from '../store/workflow-store';
import { serializeWorkflow } from '../utils/workflow';
import { useValidation } from './useValidation';

export const useSimulation = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setSimulationState = useWorkflowStore((state) => state.setSimulationState);
  const setLogsOpen = useWorkflowStore((state) => state.setLogsOpen);
  const validation = useValidation();

  const runSimulation = useCallback(async () => {
    setLogsOpen(true);

    if (!validation.isValid) {
      setSimulationState({
        simulationError: 'Fix validation issues before running the workflow.',
      });
      return { ok: false as const };
    }

    setSimulationState({
      isSimulating: true,
      simulationError: null,
      logs: [],
    });

    try {
      const payload = serializeWorkflow(nodes, edges);
      const logs = await simulateWorkflow(payload);
      setSimulationState({
        isSimulating: false,
        logs,
        simulationError: null,
      });

      return { ok: true as const };
    } catch (error) {
      setSimulationState({
        isSimulating: false,
        simulationError: error instanceof Error ? error.message : 'Simulation failed',
      });
      return { ok: false as const };
    }
  }, [edges, nodes, setLogsOpen, setSimulationState, validation.isValid]);

  return { runSimulation, validation };
};
