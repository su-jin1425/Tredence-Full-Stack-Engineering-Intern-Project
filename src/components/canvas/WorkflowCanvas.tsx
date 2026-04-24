import { useMemo } from 'react';
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, useReactFlow } from '@xyflow/react';
import type { DragEvent } from 'react';
import { useValidation } from '../../hooks/useValidation';
import { useWorkflow } from '../../hooks/useWorkflow';
import { ApprovalNode } from './nodes/ApprovalNode';
import { AutomatedNode } from './nodes/AutomatedNode';
import { EndNode } from './nodes/EndNode';
import { StartNode } from './nodes/StartNode';
import { TaskNode } from './nodes/TaskNode';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

export const WorkflowCanvas = () => {
  const {
    nodes,
    edges,
    addNode,
    onNodesChange,
    onEdgesChange,
    connectNodes,
    selectNode,
    beginInteraction,
    commitInteraction,
    darkMode,
  } = useWorkflow();
  const validation = useValidation();
  const { screenToFlowPosition } = useReactFlow();

  const decoratedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ui: {
            ...(node.data.ui ?? {}),
            validationState: validation.nodeStates[node.id],
          },
        },
      })),
    [nodes, validation.nodeStates],
  );

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');

    if (!type) {
      return;
    }

    // React Flow positions drops in viewport space, so we translate to canvas space before creating the node.
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addNode(type as Parameters<typeof addNode>[0], position);
  };

  return (
    <div className="app-panel relative h-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/50 bg-white/75 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-400">
        <span>Workflow Canvas</span>
        <span>{nodes.length} nodes • {edges.length} edges</span>
      </div>

      <div className="h-full pt-14" onDragOver={handleDragOver} onDrop={handleDrop}>
        <ReactFlow
          nodes={decoratedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={connectNodes}
          onNodeDragStart={beginInteraction}
          onNodeDragStop={() => commitInteraction('Move node')}
          onSelectionChange={({ nodes: selectedNodes }) => selectNode(selectedNodes[0]?.id ?? null)}
          onPaneClick={() => selectNode(null)}
          fitView
          deleteKeyCode={['Delete', 'Backspace']}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background
            gap={20}
            size={1}
            variant={BackgroundVariant.Dots}
            color={darkMode ? '#334155' : '#cbd5e1'}
          />
          <Controls position="bottom-right" showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            position="bottom-left"
            nodeColor={(node) => {
              switch (node.type) {
                case 'start':
                  return '#10b981';
                case 'task':
                  return '#0ea5e9';
                case 'approval':
                  return '#f59e0b';
                case 'automated':
                  return '#d946ef';
                case 'end':
                  return '#475569';
                default:
                  return '#94a3b8';
              }
            }}
            maskColor={darkMode ? 'rgba(2, 6, 23, 0.65)' : 'rgba(248, 250, 252, 0.6)'}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
