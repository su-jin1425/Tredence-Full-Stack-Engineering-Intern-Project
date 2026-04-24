import { addEdge, applyEdgeChanges, applyNodeChanges, MarkerType, type Connection, type EdgeChange, type NodeChange } from '@xyflow/react';
import { create } from 'zustand';
import type {
  AutomationAction,
  SimulationLog,
  WorkflowFlowEdge,
  WorkflowFlowNode,
  WorkflowNodeData,
  WorkflowNodeKind,
  WorkflowSnapshot,
  WorkflowVersion,
} from '../types/workflow';
import { HISTORY_LIMIT } from '../utils/constants';
import { autoLayoutWorkflow } from '../utils/layout';
import {
  cloneSnapshot,
  createNode,
  createSnapshot,
  formatVersionLabel,
  parseImportedWorkflow,
  WORKFLOW_TEMPLATES,
} from '../utils/workflow';

type WorkflowStore = {
  nodes: WorkflowFlowNode[];
  edges: WorkflowFlowEdge[];
  selectedNodeId: string | null;
  automationActions: AutomationAction[];
  past: WorkflowSnapshot[];
  future: WorkflowSnapshot[];
  versions: WorkflowVersion[];
  activeVersionId: string | null;
  draftSnapshot: WorkflowSnapshot | null;
  darkMode: boolean;
  logs: SimulationLog[];
  isLogsOpen: boolean;
  isSimulating: boolean;
  simulationError: string | null;
  setAutomationActions: (actions: AutomationAction[]) => void;
  selectNode: (nodeId: string | null) => void;
  addNode: (kind: WorkflowNodeKind, position: { x: number; y: number }) => void;
  onNodesChange: (changes: NodeChange<WorkflowFlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowFlowEdge>[]) => void;
  connectNodes: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: WorkflowNodeData) => void;
  deleteSelection: (nodeIds: string[], edgeIds: string[]) => void;
  beginInteraction: () => void;
  commitInteraction: (label: string) => void;
  undo: () => void;
  redo: () => void;
  autoLayout: () => void;
  loadTemplate: (templateId: string) => void;
  importWorkflow: (payload: string) => void;
  restoreVersion: (versionId: string) => void;
  toggleDarkMode: () => void;
  setLogsOpen: (open: boolean) => void;
  setSimulationState: (state: Partial<Pick<WorkflowStore, 'isSimulating' | 'simulationError' | 'logs'>>) => void;
};

const createVersion = (label: string, snapshot: WorkflowSnapshot): WorkflowVersion => ({
  id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12),
  label,
  createdAt: new Date().toISOString(),
  snapshot: cloneSnapshot(snapshot),
});

const emptySnapshot = createSnapshot([], []);
const initialVersion = createVersion('Initial state', emptySnapshot);

const withHistory = (
  state: WorkflowStore,
  label: string,
  nextSnapshot: WorkflowSnapshot,
): Pick<WorkflowStore, 'nodes' | 'edges' | 'past' | 'future' | 'versions' | 'activeVersionId'> => {
  const versions = [...state.versions, createVersion(label, nextSnapshot)].slice(-HISTORY_LIMIT);
  const past = [...state.past, createSnapshot(state.nodes, state.edges)].slice(-HISTORY_LIMIT);

  return {
    nodes: nextSnapshot.nodes,
    edges: nextSnapshot.edges,
    past,
    future: [],
    versions,
    activeVersionId: versions[versions.length - 1]?.id ?? state.activeVersionId,
  };
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  automationActions: [],
  past: [],
  future: [],
  versions: [initialVersion],
  activeVersionId: initialVersion.id,
  draftSnapshot: null,
  darkMode: false,
  logs: [],
  isLogsOpen: true,
  isSimulating: false,
  simulationError: null,
  setAutomationActions: (actions) => set({ automationActions: actions }),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  addNode: (kind, position) =>
    set((state) => {
      const nextSnapshot = createSnapshot([...state.nodes, createNode(kind, position)], state.edges);
      return withHistory(state, formatVersionLabel(kind), nextSnapshot);
    }),
  onNodesChange: (changes) =>
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      const hasRemoval = changes.some((change) => change.type === 'remove');

      if (hasRemoval) {
        return {
          ...withHistory(state, 'Delete node', createSnapshot(nextNodes, state.edges)),
          selectedNodeId: state.selectedNodeId && nextNodes.some((node) => node.id === state.selectedNodeId) ? state.selectedNodeId : null,
        };
      }

      return { nodes: nextNodes };
    }),
  onEdgesChange: (changes) =>
    set((state) => {
      const nextEdges = applyEdgeChanges(changes, state.edges);

      if (changes.some((change) => change.type === 'remove')) {
        return withHistory(state, 'Delete edge', createSnapshot(state.nodes, nextEdges));
      }

      return { edges: nextEdges };
    }),
  connectNodes: (connection) =>
    set((state) => {
      const nextEdges = addEdge(
        {
          ...connection,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        state.edges,
      );

      return withHistory(state, 'Connect nodes', createSnapshot(state.nodes, nextEdges));
    }),
  updateNodeData: (nodeId, data) =>
    set((state) => {
      const nextNodes = state.nodes.map((node) => (node.id === nodeId ? { ...node, data } : node));
      return withHistory(state, 'Update node configuration', createSnapshot(nextNodes, state.edges));
    }),
  deleteSelection: (nodeIds, edgeIds) =>
    set((state) => {
      const nextSnapshot = createSnapshot(
        state.nodes.filter((node) => !nodeIds.includes(node.id)),
        state.edges.filter((edge) => !edgeIds.includes(edge.id) && !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)),
      );

      return {
        ...withHistory(state, 'Delete selection', nextSnapshot),
        selectedNodeId: nodeIds.includes(state.selectedNodeId ?? '') ? null : state.selectedNodeId,
      };
    }),
  beginInteraction: () =>
    set((state) => ({
      draftSnapshot: state.draftSnapshot ?? createSnapshot(state.nodes, state.edges),
    })),
  commitInteraction: (label) =>
    set((state) => {
      if (!state.draftSnapshot) {
        return state;
      }

      const versions = [...state.versions, createVersion(label, createSnapshot(state.nodes, state.edges))].slice(-HISTORY_LIMIT);
      const past = [...state.past, state.draftSnapshot].slice(-HISTORY_LIMIT);

      return {
        past,
        future: [],
        versions,
        activeVersionId: versions[versions.length - 1]?.id ?? state.activeVersionId,
        draftSnapshot: null,
      };
    }),
  undo: () =>
    set((state) => {
      const previous = state.past[state.past.length - 1];

      if (!previous) {
        return state;
      }

      return {
        nodes: cloneSnapshot(previous).nodes,
        edges: cloneSnapshot(previous).edges,
        past: state.past.slice(0, -1),
        future: [createSnapshot(state.nodes, state.edges), ...state.future].slice(0, HISTORY_LIMIT),
        selectedNodeId: null,
      };
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0];

      if (!next) {
        return state;
      }

      return {
        nodes: cloneSnapshot(next).nodes,
        edges: cloneSnapshot(next).edges,
        past: [...state.past, createSnapshot(state.nodes, state.edges)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        selectedNodeId: null,
      };
    }),
  autoLayout: () =>
    set((state) => withHistory(state, 'Auto-layout workflow', autoLayoutWorkflow(state.nodes, state.edges))),
  loadTemplate: (templateId) =>
    set((state) => {
      const template = WORKFLOW_TEMPLATES.find((item) => item.id === templateId);

      if (!template) {
        return state;
      }

      return {
        ...withHistory(state, `Load ${template.name} template`, cloneSnapshot(template.snapshot)),
        selectedNodeId: null,
      };
    }),
  importWorkflow: (payload) =>
    set((state) => {
      const parsed = parseImportedWorkflow(JSON.parse(payload));
      return {
        ...withHistory(state, 'Import workflow JSON', parsed),
        selectedNodeId: null,
      };
    }),
  restoreVersion: (versionId) =>
    set((state) => {
      const version = state.versions.find((entry) => entry.id === versionId);

      if (!version) {
        return state;
      }

      return {
        ...withHistory(state, `Restore version: ${version.label}`, version.snapshot),
        selectedNodeId: null,
      };
    }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setLogsOpen: (open) => set({ isLogsOpen: open }),
  setSimulationState: (simulation) => set(simulation),
}));
