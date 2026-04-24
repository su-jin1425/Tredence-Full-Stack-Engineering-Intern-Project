import type {
  AutomatedNodeData,
  SerializedWorkflow,
  WorkflowFlowEdge,
  WorkflowFlowNode,
  WorkflowNodeData,
  WorkflowNodeKind,
  WorkflowSnapshot,
  WorkflowTemplate,
} from '../types/workflow';
import { NODE_LABELS } from './constants';

const createId = (prefix: string) =>
  `${prefix}_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;

const cloneDeep = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export const createEmptyPair = () => ({
  id: createId('field'),
  key: '',
  value: '',
});

export const createNodeData = (kind: WorkflowNodeKind): WorkflowNodeData => {
  switch (kind) {
    case 'start':
      return {
        kind,
        title: 'Workflow Kickoff',
        metadata: [createEmptyPair()],
      };
    case 'task':
      return {
        kind,
        title: 'HR Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [createEmptyPair()],
      };
    case 'approval':
      return {
        kind,
        title: 'Manager Approval',
        approverRole: '',
        threshold: 1,
      };
    case 'automated':
      return {
        kind,
        title: 'Automated Step',
        actionId: '',
        actionLabel: '',
        params: {},
      };
    case 'end':
      return {
        kind,
        endMessage: 'Workflow completed successfully',
        summary: true,
      };
  }
};

export const createNode = (kind: WorkflowNodeKind, position: { x: number; y: number }): WorkflowFlowNode => ({
  id: createId(kind),
  type: kind,
  position,
  data: createNodeData(kind),
});

export const cloneSnapshot = (snapshot: WorkflowSnapshot): WorkflowSnapshot => cloneDeep(snapshot);

export const createSnapshot = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]): WorkflowSnapshot => ({
  nodes: cloneDeep(nodes),
  edges: cloneDeep(edges),
});

export const getNodeLabel = (data: WorkflowNodeData): string => {
  switch (data.kind) {
    case 'start':
    case 'task':
    case 'approval':
    case 'automated':
      return data.title;
    case 'end':
      return data.endMessage;
  }
};

export const getNodeSubtitle = (data: WorkflowNodeData): string => {
  switch (data.kind) {
    case 'start':
      return 'Entry point';
    case 'task':
      return data.assignee ? `Assigned to ${data.assignee}` : 'Manual action';
    case 'approval':
      return data.approverRole ? `${data.approverRole} approval` : 'Approval gate';
    case 'automated':
      return data.actionLabel || 'Automation not selected';
    case 'end':
      return data.summary ? 'Summary enabled' : 'Silent completion';
  }
};

export const isAutomatedNodeComplete = (data: AutomatedNodeData, actionParams: string[]): boolean =>
  Boolean(data.actionId) && actionParams.every((param) => Boolean(data.params[param]?.trim()));

export const serializeWorkflow = (nodes: WorkflowFlowNode[], edges: WorkflowFlowEdge[]): SerializedWorkflow => ({
  name: 'HR Workflow Designer Export',
  exportedAt: new Date().toISOString(),
  nodes: nodes.map((node) => {
    const safeData = Object.fromEntries(Object.entries(node.data).filter(([key]) => key !== 'ui')) as Omit<
      WorkflowNodeData,
      'ui'
    >;

    return {
      id: node.id,
      type: node.type as WorkflowNodeKind,
      position: node.position,
      data: safeData,
    };
  }),
  edges,
});

export const parseImportedWorkflow = (payload: SerializedWorkflow): WorkflowSnapshot => ({
  nodes: payload.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data as WorkflowNodeData,
  })),
  edges: payload.edges,
});

export const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const getNodeAccent = (kind: WorkflowNodeKind) => {
  switch (kind) {
    case 'start':
      return 'from-emerald-500 to-teal-500';
    case 'task':
      return 'from-sky-500 to-cyan-500';
    case 'approval':
      return 'from-amber-500 to-orange-500';
    case 'automated':
      return 'from-fuchsia-500 to-pink-500';
    case 'end':
      return 'from-slate-500 to-slate-700';
  }
};

export const createTemplateSnapshot = (
  entries: Array<{ id: string; kind: WorkflowNodeKind; x: number; y: number; data?: Partial<WorkflowNodeData> }>,
  connections: Array<{ source: string; target: string }>,
): WorkflowSnapshot => ({
  nodes: entries.map((entry) => ({
    id: entry.id,
    type: entry.kind,
    position: { x: entry.x, y: entry.y },
    data: {
      ...createNodeData(entry.kind),
      ...entry.data,
      kind: entry.kind,
    } as WorkflowNodeData,
  })),
  edges: connections.map((connection) => ({
    id: createId('edge'),
    source: connection.source,
    target: connection.target,
  })),
});

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Collect documents, create accounts, and close with a welcome summary.',
    snapshot: createTemplateSnapshot(
      [
        {
          id: 'start_onboarding',
          kind: 'start',
          x: 40,
          y: 140,
          data: {
            title: 'New Hire Trigger',
            metadata: [{ id: createId('meta'), key: 'source', value: 'HRIS' }],
          },
        },
        {
          id: 'task_documents',
          kind: 'task',
          x: 320,
          y: 80,
          data: {
            title: 'Collect Documents',
            description: 'Request ID proof, tax forms, and signed policy documents.',
            assignee: 'HR Coordinator',
            dueDate: '2026-04-30',
            customFields: [{ id: createId('field'), key: 'priority', value: 'High' }],
          },
        },
        {
          id: 'automation_accounts',
          kind: 'automated',
          x: 620,
          y: 80,
          data: {
            title: 'Create Workspace Accounts',
            actionId: 'send_email',
            actionLabel: 'Send Email',
            params: {
              to: 'it-support@company.com',
              subject: 'Provision workspace for new hire',
            },
          },
        },
        {
          id: 'approval_manager',
          kind: 'approval',
          x: 620,
          y: 250,
          data: {
            title: 'Manager Approval',
            approverRole: 'Hiring Manager',
            threshold: 1,
          },
        },
        {
          id: 'end_onboarding',
          kind: 'end',
          x: 930,
          y: 160,
          data: {
            endMessage: 'Onboarding completed',
            summary: true,
          },
        },
      ],
      [
        { source: 'start_onboarding', target: 'task_documents' },
        { source: 'task_documents', target: 'automation_accounts' },
        { source: 'automation_accounts', target: 'approval_manager' },
        { source: 'approval_manager', target: 'end_onboarding' },
      ],
    ),
  },
  {
    id: 'leave-approval',
    name: 'Leave Approval',
    description: 'Route leave requests through policy checks and manager approval.',
    snapshot: createTemplateSnapshot(
      [
        {
          id: 'start_leave',
          kind: 'start',
          x: 40,
          y: 120,
          data: {
            title: 'Leave Requested',
            metadata: [{ id: createId('meta'), key: 'channel', value: 'Employee Portal' }],
          },
        },
        {
          id: 'task_review',
          kind: 'task',
          x: 320,
          y: 120,
          data: {
            title: 'Review Balance',
            description: 'Check leave balance, blackout dates, and roster coverage.',
            assignee: 'HR Ops',
            dueDate: '2026-05-02',
            customFields: [{ id: createId('field'), key: 'policy', value: 'Annual Leave' }],
          },
        },
        {
          id: 'approval_leave',
          kind: 'approval',
          x: 620,
          y: 120,
          data: {
            title: 'Manager Sign-off',
            approverRole: 'Reporting Manager',
            threshold: 1,
          },
        },
        {
          id: 'end_leave',
          kind: 'end',
          x: 900,
          y: 120,
          data: {
            endMessage: 'Leave workflow closed',
            summary: true,
          },
        },
      ],
      [
        { source: 'start_leave', target: 'task_review' },
        { source: 'task_review', target: 'approval_leave' },
        { source: 'approval_leave', target: 'end_leave' },
      ],
    ),
  },
  {
    id: 'document-verification',
    name: 'Document Verification',
    description: 'Verify documents with automation before final confirmation.',
    snapshot: createTemplateSnapshot(
      [
        {
          id: 'start_document',
          kind: 'start',
          x: 40,
          y: 140,
          data: {
            title: 'Document Uploaded',
            metadata: [{ id: createId('meta'), key: 'type', value: 'Background Check' }],
          },
        },
        {
          id: 'automation_doc',
          kind: 'automated',
          x: 320,
          y: 140,
          data: {
            title: 'Generate Verification Request',
            actionId: 'generate_doc',
            actionLabel: 'Generate Document',
            params: {
              template: 'verification-request',
              recipient: 'compliance@company.com',
            },
          },
        },
        {
          id: 'task_followup',
          kind: 'task',
          x: 620,
          y: 140,
          data: {
            title: 'Compliance Review',
            description: 'Review returned documents and record verification outcome.',
            assignee: 'Compliance Lead',
            dueDate: '2026-05-05',
            customFields: [{ id: createId('field'), key: 'sla', value: '48 hours' }],
          },
        },
        {
          id: 'end_document',
          kind: 'end',
          x: 900,
          y: 140,
          data: {
            endMessage: 'Verification completed',
            summary: true,
          },
        },
      ],
      [
        { source: 'start_document', target: 'automation_doc' },
        { source: 'automation_doc', target: 'task_followup' },
        { source: 'task_followup', target: 'end_document' },
      ],
    ),
  },
];

export const formatVersionLabel = (kind: WorkflowNodeKind) => `Add ${NODE_LABELS[kind]} node`;
