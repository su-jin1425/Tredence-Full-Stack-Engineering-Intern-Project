import type {
  AutomationAction,
  ValidationIssue,
  ValidationResult,
  WorkflowFlowEdge,
  WorkflowFlowNode,
  WorkflowNodeData,
} from '../types/workflow';
import { automatedNodeSchema, workflowNodeDataSchema } from '../types/workflow';

const createNodeStateMap = (nodes: WorkflowFlowNode[]) =>
  nodes.reduce<Record<string, ValidationResult['nodeStates'][string]>>((accumulator, node) => {
    accumulator[node.id] = 'valid';
    return accumulator;
  }, {});

const markNode = (nodeStates: ValidationResult['nodeStates'], nodeId: string | undefined, state: 'invalid' | 'warning') => {
  if (!nodeId) {
    return;
  }

  nodeStates[nodeId] = state;
};

const getActionParams = (actionId: string, actions: AutomationAction[]) =>
  actions.find((action) => action.id === actionId)?.params ?? [];

const validateNodeFields = (
  node: WorkflowFlowNode,
  actions: AutomationAction[],
): ValidationIssue | null => {
  const baseParse = workflowNodeDataSchema.safeParse(node.data);

  if (!baseParse.success) {
    return {
      code: 'required-fields',
      message: `${node.type} node contains invalid or incomplete fields`,
      nodeId: node.id,
      severity: 'error',
    };
  }

  if (node.data.kind === 'automated') {
    const params = getActionParams(node.data.actionId, actions);
    const automatedParse = automatedNodeSchema.superRefine((value, context) => {
      params.forEach((param) => {
        if (!value.params[param]?.trim()) {
          context.addIssue({
            code: 'custom',
            message: `${param} is required for the selected automation`,
            path: ['params', param],
          });
        }
      });
    });

    if (!automatedParse.safeParse(node.data).success) {
      return {
        code: 'required-fields',
        message: 'Automated step is missing required action parameters',
        nodeId: node.id,
        severity: 'error',
      };
    }
  }

  return null;
};

const buildAdjacency = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]) => {
  const adjacency = new Map<string, string[]>();
  const indegree = new Map<string, number>();

  nodes.forEach((node) => {
    adjacency.set(node.id, []);
    indegree.set(node.id, 0);
  });

  edges.forEach((edge) => {
    adjacency.get(edge.source)?.push(edge.target);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  });

  return { adjacency, indegree };
};

const detectCycle = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]) => {
  const { adjacency } = buildAdjacency(nodes, edges);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let cycleNodeId: string | undefined;

  const dfs = (nodeId: string): boolean => {
    visiting.add(nodeId);

    for (const target of adjacency.get(nodeId) ?? []) {
      if (visited.has(target)) {
        continue;
      }

      if (visiting.has(target)) {
        cycleNodeId = target;
        return true;
      }

      if (dfs(target)) {
        cycleNodeId = cycleNodeId ?? target;
        return true;
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) {
      return cycleNodeId;
    }
  }

  return undefined;
};

const findDisconnectedNodes = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[], startNodeId?: string) => {
  if (!startNodeId) {
    return nodes.map((node) => node.id);
  }

  const { adjacency } = buildAdjacency(nodes, edges);
  const reachable = new Set<string>([startNodeId]);
  const queue = [startNodeId];

  while (queue.length) {
    const current = queue.shift()!;

    for (const target of adjacency.get(current) ?? []) {
      if (!reachable.has(target)) {
        reachable.add(target);
        queue.push(target);
      }
    }
  }

  return nodes.filter((node) => !reachable.has(node.id)).map((node) => node.id);
};

export const validateWorkflow = (
  nodes: WorkflowFlowNode[],
  edges: WorkflowFlowEdge[],
  actions: AutomationAction[],
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const nodeStates = createNodeStateMap(nodes);
  const startNodes = nodes.filter((node) => node.type === 'start');
  const endNodes = nodes.filter((node) => node.type === 'end');
  const { indegree } = buildAdjacency(nodes, edges);

  if (startNodes.length !== 1) {
    issues.push({
      code: 'start-count',
      message: 'Workflow must contain exactly one Start node',
      severity: 'error',
      nodeId: startNodes[0]?.id,
    });
    startNodes.forEach((node) => markNode(nodeStates, node.id, 'invalid'));
  }

  if (endNodes.length < 1) {
    issues.push({
      code: 'end-count',
      message: 'Workflow must contain at least one End node',
      severity: 'error',
    });
  }

  startNodes.forEach((node) => {
    if ((indegree.get(node.id) ?? 0) > 0) {
      issues.push({
        code: 'start-order',
        message: 'Start node cannot have incoming connections',
        nodeId: node.id,
        severity: 'error',
      });
      markNode(nodeStates, node.id, 'invalid');
    }
  });

  nodes
    .filter((node) => node.type !== 'start')
    .forEach((node) => {
      if ((indegree.get(node.id) ?? 0) === 0) {
        issues.push({
          code: 'start-order',
          message: `${node.type} node is not connected after the Start node`,
          nodeId: node.id,
          severity: 'error',
        });
        markNode(nodeStates, node.id, 'invalid');
      }
    });

  const cycleNodeId = detectCycle(nodes, edges);

  if (cycleNodeId) {
    issues.push({
      code: 'cycle',
      message: 'Workflow contains a cycle',
      nodeId: cycleNodeId,
      severity: 'error',
    });
    markNode(nodeStates, cycleNodeId, 'invalid');
  }

  const disconnectedNodes = findDisconnectedNodes(nodes, edges, startNodes[0]?.id);

  disconnectedNodes.forEach((nodeId) => {
    issues.push({
      code: 'disconnected-node',
      message: 'Node is disconnected from the main workflow path',
      nodeId,
      severity: 'error',
    });
    markNode(nodeStates, nodeId, 'invalid');
  });

  nodes.forEach((node) => {
    const fieldIssue = validateNodeFields(node, actions);

    if (fieldIssue) {
      issues.push(fieldIssue);
      markNode(nodeStates, node.id, 'invalid');
    }
  });

  return {
    isValid: issues.every((issue) => issue.severity !== 'error'),
    issues,
    nodeStates,
  };
};

export const getValidationTone = (state: WorkflowNodeData['ui'] extends { validationState?: infer T } ? T : never) => {
  switch (state) {
    case 'invalid':
      return 'border-rose-400/70 bg-rose-500/8';
    case 'warning':
      return 'border-amber-400/70 bg-amber-500/10';
    default:
      return 'border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/80';
  }
};
