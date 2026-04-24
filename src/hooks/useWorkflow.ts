import { useShallow } from 'zustand/react/shallow';
import { useWorkflowStore } from '../store/workflow-store';

export const useWorkflow = () => {
  return useWorkflowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedNodeId: state.selectedNodeId,
      automationActions: state.automationActions,
      past: state.past,
      future: state.future,
      versions: state.versions,
      activeVersionId: state.activeVersionId,
      darkMode: state.darkMode,
      logs: state.logs,
      isLogsOpen: state.isLogsOpen,
      isSimulating: state.isSimulating,
      simulationError: state.simulationError,
      setAutomationActions: state.setAutomationActions,
      selectNode: state.selectNode,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      connectNodes: state.connectNodes,
      updateNodeData: state.updateNodeData,
      deleteSelection: state.deleteSelection,
      beginInteraction: state.beginInteraction,
      commitInteraction: state.commitInteraction,
      undo: state.undo,
      redo: state.redo,
      autoLayout: state.autoLayout,
      loadTemplate: state.loadTemplate,
      importWorkflow: state.importWorkflow,
      restoreVersion: state.restoreVersion,
      toggleDarkMode: state.toggleDarkMode,
      setLogsOpen: state.setLogsOpen,
      setSimulationState: state.setSimulationState,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
    })),
  );
};
