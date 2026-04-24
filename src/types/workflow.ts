import type { Edge, Node, XYPosition } from '@xyflow/react';
import { z } from 'zod';

export type WorkflowNodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

export type KeyValueField = {
  id: string;
  key: string;
  value: string;
};

const keyValueFieldSchema = z.object({
  id: z.string(),
  key: z.string().trim(),
  value: z.string().trim(),
});

export const startNodeSchema = z.object({
  kind: z.literal('start'),
  title: z.string().trim().min(2, 'Title is required'),
  metadata: z
    .array(keyValueFieldSchema)
    .superRefine((items, context) => {
      items.forEach((item, index) => {
        if ((item.key && !item.value) || (!item.key && item.value)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Metadata rows require both key and value',
            path: [index],
          });
        }
      });
    }),
  ui: z
    .object({
      validationState: z.enum(['valid', 'invalid', 'warning']).optional(),
    })
    .optional(),
});

export const taskNodeSchema = z.object({
  kind: z.literal('task'),
  title: z.string().trim().min(2, 'Title is required'),
  description: z.string().trim().min(5, 'Description is required'),
  assignee: z.string().trim().min(2, 'Assignee is required'),
  dueDate: z.string().trim().min(1, 'Due date is required'),
  customFields: z
    .array(keyValueFieldSchema)
    .superRefine((items, context) => {
      items.forEach((item, index) => {
        if ((item.key && !item.value) || (!item.key && item.value)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Custom field rows require both key and value',
            path: [index],
          });
        }
      });
    }),
  ui: z
    .object({
      validationState: z.enum(['valid', 'invalid', 'warning']).optional(),
    })
    .optional(),
});

export const approvalNodeSchema = z.object({
  kind: z.literal('approval'),
  title: z.string().trim().min(2, 'Title is required'),
  approverRole: z.string().trim().min(2, 'Approver role is required'),
  threshold: z.coerce.number().min(1, 'Threshold must be at least 1').max(100, 'Threshold must be 100 or less'),
  ui: z
    .object({
      validationState: z.enum(['valid', 'invalid', 'warning']).optional(),
    })
    .optional(),
});

export const automatedNodeSchema = z.object({
  kind: z.literal('automated'),
  title: z.string().trim().min(2, 'Title is required'),
  actionId: z.string().trim().min(1, 'Automation action is required'),
  actionLabel: z.string().optional(),
  params: z.record(z.string().trim()),
  ui: z
    .object({
      validationState: z.enum(['valid', 'invalid', 'warning']).optional(),
    })
    .optional(),
});

export const endNodeSchema = z.object({
  kind: z.literal('end'),
  endMessage: z.string().trim().min(2, 'End message is required'),
  summary: z.boolean(),
  ui: z
    .object({
      validationState: z.enum(['valid', 'invalid', 'warning']).optional(),
    })
    .optional(),
});

export const workflowNodeDataSchema = z.discriminatedUnion('kind', [
  startNodeSchema,
  taskNodeSchema,
  approvalNodeSchema,
  automatedNodeSchema,
  endNodeSchema,
]);

export type StartNodeData = z.infer<typeof startNodeSchema>;
export type TaskNodeData = z.infer<typeof taskNodeSchema>;
export type ApprovalNodeData = z.infer<typeof approvalNodeSchema>;
export type AutomatedNodeData = z.infer<typeof automatedNodeSchema>;
export type EndNodeData = z.infer<typeof endNodeSchema>;
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowFlowNode = Node<WorkflowNodeData, WorkflowNodeKind>;
export type WorkflowFlowEdge = Edge;

export type NodeFactoryInput = {
  kind: WorkflowNodeKind;
  position: XYPosition;
};

export type ValidationState = 'valid' | 'invalid' | 'warning';

export type ValidationIssueCode =
  | 'start-count'
  | 'end-count'
  | 'disconnected-node'
  | 'cycle'
  | 'start-order'
  | 'required-fields';

export type ValidationIssue = {
  code: ValidationIssueCode;
  message: string;
  nodeId?: string;
  severity: 'error' | 'warning';
};

export type ValidationResult = {
  isValid: boolean;
  issues: ValidationIssue[];
  nodeStates: Record<string, ValidationState>;
};

export type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

export type SimulationLog = {
  id: string;
  step: string;
  status: 'pending' | 'running' | 'success' | 'warning';
  message: string;
  timestamp: string;
};

export type SerializedWorkflowNode = {
  id: string;
  type: WorkflowNodeKind;
  position: XYPosition;
  data: Omit<WorkflowNodeData, 'ui'>;
};

export type SerializedWorkflow = {
  name: string;
  exportedAt: string;
  nodes: SerializedWorkflowNode[];
  edges: WorkflowFlowEdge[];
};

export type WorkflowSnapshot = {
  nodes: WorkflowFlowNode[];
  edges: WorkflowFlowEdge[];
};

export type WorkflowVersion = {
  id: string;
  label: string;
  createdAt: string;
  snapshot: WorkflowSnapshot;
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  snapshot: WorkflowSnapshot;
};
