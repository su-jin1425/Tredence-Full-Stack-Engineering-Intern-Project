import type { WorkflowFlowEdge, WorkflowFlowNode, WorkflowSnapshot } from '../types/workflow';
import { createSnapshot } from './workflow';

const HORIZONTAL_GAP = 300;
const VERTICAL_GAP = 180;

export const autoLayoutWorkflow = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]): WorkflowSnapshot => {
  const next = createSnapshot(nodes, edges);
  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  next.nodes.forEach((node) => {
    indegree.set(node.id, 0);
    adjacency.set(node.id, []);
  });

  next.edges.forEach((edge) => {
    adjacency.get(edge.source)?.push(edge.target);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  });

  const startNode = next.nodes.find((node) => node.type === 'start') ?? next.nodes[0];
  const queue = startNode ? [startNode.id] : [];
  const depth = new Map<string, number>(startNode ? [[startNode.id, 0]] : []);
  const visited = new Set(queue);

  while (queue.length) {
    const current = queue.shift()!;

    adjacency.get(current)?.forEach((target) => {
      const nextDepth = (depth.get(current) ?? 0) + 1;

      if (!depth.has(target) || nextDepth > (depth.get(target) ?? 0)) {
        depth.set(target, nextDepth);
      }

      if (!visited.has(target)) {
        visited.add(target);
        queue.push(target);
      }
    });
  }

  const columns = new Map<number, WorkflowFlowNode[]>();

  next.nodes.forEach((node) => {
    const column = depth.get(node.id) ?? Math.max(1, ...depth.values(), 0) + 1;
    const group = columns.get(column) ?? [];
    group.push(node);
    columns.set(column, group);
  });

  columns.forEach((group, column) => {
    group.forEach((node, index) => {
      node.position = {
        x: column * HORIZONTAL_GAP,
        y: index * VERTICAL_GAP + 80,
      };
    });
  });

  return next;
};
