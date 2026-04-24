import type { AutomationAction, WorkflowNodeKind } from '../types/workflow';

export const NODE_LABELS: Record<WorkflowNodeKind, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated',
  end: 'End',
};

export const AUTOMATION_ACTIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

export const HISTORY_LIMIT = 40;

export const SIDEBAR_NODE_ORDER: WorkflowNodeKind[] = ['start', 'task', 'approval', 'automated', 'end'];
