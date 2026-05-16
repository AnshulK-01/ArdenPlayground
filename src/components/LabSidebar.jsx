import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Table, Zap, Info } from 'lucide-react';
import { useState } from 'react';
import TransitionTable from './TransitionTable';
import StringTester from './StringTester';

/**
 * Collapsible Right Lab Sidebar
 * Contains: Transition Matrix, String Simulator
 */
export default function LabSidebar({ automaton, onHighlight }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('table');

  const tabs = [
    { id: 'table', icon: Table, label: 'Transition Table' },
    { id: 'tester', icon: Zap, label: 'Simulator' },
  ];

  return (
    <div style={{ position: 'relative', height: '100%', pointerEvents: 'none' }}>
      {/* Toggle Button */}
      <div
        // style={{
        //   position: 'absolute',
        //   left: isOpen ? '-40px' : '-40px',
        //   top: '20px',
        //   pointerEvents: 'all',
        //   zIndex: 100,
        // }}
      >
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px 0 0 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRight: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
          }}
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button> */}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-strong"
            style={{
              width: '380px',
              height: '100%',
              pointerEvents: 'all',
              borderLeft: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                    color: activeTab === tab.id ? '#f8fafc' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                  }}
                >
                  <tab.icon size={14} color={activeTab === tab.id ? '#3b82f6' : '#64748b'} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeTab === 'table' && <TransitionTable automaton={automaton} />}
              {activeTab === 'tester' && <StringTester automaton={automaton} onHighlight={onHighlight} />}
            </div>

            {/* Help Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(59, 130, 246, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Info size={16} color="#3b82f6" />
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                  Select a state to mark it as Final or edit transitions using the bottom panel. 
                  Pan and zoom the canvas for better visualization.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
