import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

/**
 * Premium Automata Node
 * Matches the requested "clean" visual style: 
 * Solid blue circle, thin white border, green double ring for final states.
 */
export default function AutomataNode({ data }) {
  const { label, isFinal, isHighlighted, isStart } = data;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isHighlighted ? 1.1 : 1, 
        opacity: 1,
        boxShadow: isHighlighted ? '0 0 30px rgba(59, 130, 246, 0.6)' : 'none'
      }}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: '#3b82f6', // Bright blue solid
        border: '3px solid #bfdbfe', // Light blue/white border
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Label */}
      {label}

      {/* Start State Indicator - Points into the node from left */}
      {isStart && (
        <div
          style={{
            position: 'absolute',
            left: '-55px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        >
          <svg width="50" height="20" viewBox="0 0 50 20">
            <path d="M 0 10 L 40 10" stroke="#3b82f6" strokeWidth="4" fill="none" />
            <path d="M 42 10 L 30 2 L 30 18 Z" fill="#3b82f6" />
          </svg>
        </div>
      )}

      {/* Final State Double Ring */}
      {isFinal && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '4px solid #10b981',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 4,
              borderRadius: '50%',
              border: '2px solid #10b981',
              opacity: 0.6
            }}
          />
        </div>
      )}

      {/* Single invisible handle for React Flow logic */}
      <Handle type="source" position={Position.Top} style={{ opacity: 0, top: '50%', left: '50%' }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, top: '50%', left: '50%' }} />
    </motion.div>
  );
}
