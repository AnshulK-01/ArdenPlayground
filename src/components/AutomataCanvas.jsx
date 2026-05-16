import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AutomataNode from './AutomataNode';
import AutomataEdge from './AutomataEdge';
import { statesToNodes, transitionsToEdges, getLayoutedElements } from '../utils/graphHelpers';

const nodeTypes = { automataNode: AutomataNode };
const edgeTypes = { automataEdge: AutomataEdge };

export default function AutomataCanvas({
  automaton,
  positions,
  onPositionChange,
  highlightedState,
  highlightedEdge,
}) {
  // 1. Initial nodes and edges conversion
  const initialNodes = useMemo(
    () => statesToNodes(automaton.states, automaton.startState, automaton.finalStates, positions, highlightedState),
    [automaton.states, automaton.startState, automaton.finalStates, positions, highlightedState]
  );

  const initialEdges = useMemo(
    () => transitionsToEdges(automaton.transitions, highlightedEdge),
    [automaton.transitions, highlightedEdge]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 2. Handle automatic layout when automaton changes
  useEffect(() => {
    // If we have no positions (new automaton or example), layout it
    const hasPositions = Object.keys(positions).length > 0;
    
    if (!hasPositions && automaton.states.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      
      // Notify parent about new positions
      layoutedNodes.forEach(node => {
        onPositionChange(node.id, node.position);
      });
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, automaton.states.length, positions, onPositionChange, setNodes, setEdges]);

  const onNodeDragStop = useCallback(
    (event, node) => {
      onPositionChange(node.id, node.position);
    },
    [onPositionChange]
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color="rgba(255, 255, 255, 0.03)" gap={20} size={1} />
        
        {/* Custom SVG Markers */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker
              id="arrowhead-hl"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
        </svg>

        <Controls
          position="top-left"
          style={{ 
            top: 20, 
            left: 20,
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
          showInteractive={false}
        />
      </ReactFlow>

      {/* Empty state overlay */}
      {automaton.states.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div className="animate-pulse" style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.2, color: '#3b82f6' }}>
            
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>
            AWAITING INPUT
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
            Use the bottom panel to design your automaton
          </p>
        </div>
      )}
    </div>
  );
}
