import { motion } from 'framer-motion';
import { Plus, ArrowRight, Star, Trash2, Bot, Play, Circle } from 'lucide-react';

/**
 * Floating Left Toolbar
 * Features: Add State, Add Transition, Mark Final, Delete, AI Assistant
 */
export default function Toolbar({ 
  onAddState, 
  onAddTransition, 
  onToggleFinal, 
  onDeleteSelected, 
  onToggleAI, 
  isAIOpen 
}) {
  const tools = [
    { id: 'add-state', icon: Circle, label: 'Add State', onClick: onAddState, color: '#3b82f6' },
    { id: 'add-trans', icon: ArrowRight, label: 'Add Transition', onClick: onAddTransition, color: '#3b82f6' },
    { id: 'toggle-final', icon: Star, label: 'Toggle Final', onClick: onToggleFinal, color: '#10b981' },
    { id: 'delete', icon: Trash2, label: 'Delete Selected', onClick: onDeleteSelected, color: '#ef4444' },
    { id: 'ai', icon: Bot, label: 'AI Assistant', onClick: onToggleAI, color: isAIOpen ? '#3b82f6' : '#94a3b8', active: isAIOpen },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 50,
      }}
    >
      {tools.map((tool, i) => (
        <motion.button
          key={tool.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={tool.onClick}
          className="glass"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${tool.active ? tool.color : 'rgba(59, 130, 246, 0.2)'}`,
            background: tool.active ? `${tool.color}20` : 'rgba(15, 23, 42, 0.8)',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            color: tool.color,
          }}
          title={tool.label}
        >
          <tool.icon size={22} />
        </motion.button>
      ))}
    </div>
  );
}
