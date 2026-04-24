import type { AutomationAction, SerializedWorkflow, SimulationLog, WorkflowFlowEdge, WorkflowFlowNode, WorkflowNodeData } from '../types/workflow';
import { AUTOMATION_ACTIONS } from '../utils/constants';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const sortNodesForSimulation = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]) => {
  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  nodes.forEach((node) => {
    indegree.set(node.id, 0);
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    adjacency.get(edge.source)?.push(edge.target);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  });

  const queue = nodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id);
  const result: WorkflowFlowNode[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    const currentNode = nodes.find((node) => node.id === current);

    if (currentNode) {
      result.push(currentNode);
    }

    for (const target of adjacency.get(current) ?? []) {
      indegree.set(target, (indegree.get(target) ?? 1) - 1);

      if ((indegree.get(target) ?? 0) === 0) {
        queue.push(target);
      }
    }
  }

  return result;
};

const nodeMessage = (node: WorkflowFlowNode) => {
  const data = node.data as WorkflowNodeData;

  switch (data.kind) {
    case 'start':
      return `Started workflow from "${data.title}"`;
    case 'task':
      return `Completed task "${data.title}" for ${data.assignee}`;
    case 'approval':
      return `Approval granted by ${data.approverRole}`;
    case 'automated':
      return `Executed "${data.actionLabel || data.actionId}" automation`;
    case 'end':
      return data.endMessage;
  }
};

export const getAutomations = async (): Promise<AutomationAction[]> => {
  await wait(350);
  return AUTOMATION_ACTIONS;
};

export const simulateWorkflow = async (workflow: SerializedWorkflow): Promise<SimulationLog[]> => {
  await wait(450);

  const orderedNodes = sortNodesForSimulation(
    workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data as WorkflowNodeData,
    })),
    workflow.edges,
  );

  const logs: SimulationLog[] = orderedNodes.map((node, index) => ({
    id: `${node.id}_${index}`,
    step: `${index + 1}`,
    status: index === orderedNodes.length - 1 ? 'success' : 'running',
    message: nodeMessage(node),
    timestamp: new Date(Date.now() + index * 1000).toISOString(),
  }));

  logs.push({
    id: 'workflow_complete',
    step: `${logs.length + 1}`,
    status: 'success',
    message: 'Workflow simulation finished successfully',
    timestamp: new Date(Date.now() + logs.length * 1000).toISOString(),
  });

  return logs;
};
