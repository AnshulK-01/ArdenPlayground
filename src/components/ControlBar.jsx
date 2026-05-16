import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, Star, Play, Circle } from 'lucide-react';

/**
 * Premium Horizontal Control Bar
 * Card-based horizontal layout for State, Transition, States, and String Tester.
 */
export default function ControlBar({ 
  automaton, 
  onAddState, 
  onAddTransition, 
  onToggleFinal, 
  onTestString,
  isTestLoading
}) {
  const [newStateName, setNewStateName] = useState('');
  const [transFrom, setTransFrom] = useState('');
  const [transTo, setTransTo] = useState('');
  const [transSymbol, setTransSymbol] = useState('');
  const [finalState, setFinalState] = useState('');
  const [testInput, setTestInput] = useState('');

  const cardStyle = {
    flex: 1,
    minWidth: '220px',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '2px'
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      style={{
        width: '100%',
        padding: '20px 24px',
        background: 'rgba(2, 6, 23, 0.95)',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        gap: '16px',
        zIndex: 500,
        overflowX: 'auto',
      }}
    >
      {/* STATE CARD */}
      <div style={cardStyle}>
        <div style={labelStyle}>State</div>
        <input
          className="input-field"
          placeholder="State Name"
          value={newStateName}
          onChange={(e) => setNewStateName(e.target.value)}
          style={{ fontSize: '13px' }}
        />
        <button 
          className="btn-primary" 
          onClick={() => { if(newStateName) { onAddState(newStateName); setNewStateName(''); } }}
          style={{ width: '100%', padding: '10px', fontWeight: 700 }}
        >
          Add State
        </button>
      </div>

      {/* TRANSITION CARD */}
      <div style={{ ...cardStyle, flex: 1.5 }}>
        <div style={labelStyle}>Transition</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select 
            className="select-field" 
            value={transFrom} 
            onChange={(e) => setTransFrom(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">From</option>
            {automaton.states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="select-field" 
            value={transTo} 
            onChange={(e) => setTransTo(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">To</option>
            {automaton.states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <input
          className="input-field"
          placeholder="Symbol"
          value={transSymbol}
          onChange={(e) => setTransSymbol(e.target.value)}
          style={{ width: '100%' }}
        />
        <button 
          className="btn-primary" 
          onClick={() => { if(transFrom && transTo && transSymbol) { onAddTransition(transFrom, transTo, transSymbol); setTransSymbol(''); } }}
          style={{ width: '100%', padding: '10px', fontWeight: 700 }}
        >
          Add Transition
        </button>
      </div>

      {/* STATES CARD */}
      <div style={cardStyle}>
        <div style={labelStyle}>States</div>
        <select 
          className="select-field" 
          value={finalState} 
          onChange={(e) => setFinalState(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">Select State</option>
          {automaton.states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button 
          className="btn-primary" 
          onClick={() => { if(finalState) { onToggleFinal(finalState); } }}
          style={{ width: '100%', padding: '10px', fontWeight: 700, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
        >
          Mark Final
        </button>
      </div>

    </motion.div>
  );
}
