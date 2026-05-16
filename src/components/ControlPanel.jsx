import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Circle, Play, ArrowRight, Star } from 'lucide-react';

export default function ControlPanel({
  automaton,
  onAddState,
  onRemoveState,
  onAddTransition,
  onRemoveTransition,
  onSetStartState,
  onToggleFinalState,
}) {
  const [newStateName, setNewStateName] = useState('');
  const [transFrom, setTransFrom] = useState('');
  const [transTo, setTransTo] = useState('');
  const [transSymbol, setTransSymbol] = useState('');
  const [activeTab, setActiveTab] = useState('states');

  const handleAddState = () => {
    const name = newStateName.trim();
    if (name && !automaton.states.includes(name)) {
      onAddState(name);
      setNewStateName('');
    }
  };

  const handleAddTransition = () => {
    if (transFrom && transTo && transSymbol.trim()) {
      onAddTransition(transFrom, transTo, transSymbol.trim());
      setTransSymbol('');
    }
  };

  const tabs = [
    { id: 'states', label: 'States', icon: Circle },
    { id: 'transitions', label: 'Transitions', icon: ArrowRight },
  ];

  return (
    <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(59, 130, 246, 0.15)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === tab.id ? '#e2e8f0' : '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'states' && (
            <motion.div key="states" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              {/* Add State */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <input
                  className="input-field"
                  placeholder="State name (e.g., q0)"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddState()}
                  style={{ flex: 1, fontSize: '12px' }}
                />
                <button className="btn-primary" onClick={handleAddState} style={{ padding: '8px 12px' }}>
                  <Plus size={14} />
                </button>
              </div>

              {/* State List */}
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {automaton.states.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                    No states yet. Add your first state above.
                  </p>
                ) : (
                  automaton.states.map((state) => (
                    <motion.div
                      key={state}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(59, 130, 246, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: 600 }}>{state}</span>
                        {state === automaton.startState && <span className="badge badge-success" style={{ fontSize: '9px' }}>START</span>}
                        {automaton.finalStates.includes(state) && <span className="badge badge-info" style={{ fontSize: '9px' }}>FINAL</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => onSetStartState(state)}
                          title="Set as start"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: state === automaton.startState ? '#10b981' : '#64748b', transition: 'color 0.2s' }}
                        >
                          <Play size={12} />
                        </button>
                        <button
                          onClick={() => onToggleFinalState(state)}
                          title="Toggle final"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: automaton.finalStates.includes(state) ? '#3b82f6' : '#64748b', transition: 'color 0.2s' }}
                        >
                          <Star size={12} />
                        </button>
                        <button
                          onClick={() => onRemoveState(state)}
                          title="Remove"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b', transition: 'color 0.2s' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'transitions' && (
            <motion.div key="transitions" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <select className="select-field" value={transFrom} onChange={(e) => setTransFrom(e.target.value)} style={{ flex: 1, fontSize: '12px', minWidth: '70px' }}>
                  <option value="">From</option>
                  {automaton.states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  className="input-field"
                  placeholder="Symbol"
                  value={transSymbol}
                  onChange={(e) => setTransSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTransition()}
                  style={{ width: '60px', fontSize: '12px', textAlign: 'center' }}
                />
                <select className="select-field" value={transTo} onChange={(e) => setTransTo(e.target.value)} style={{ flex: 1, fontSize: '12px', minWidth: '70px' }}>
                  <option value="">To</option>
                  {automaton.states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn-primary" onClick={handleAddTransition} style={{ padding: '8px 12px' }}>
                  <Plus size={14} />
                </button>
              </div>

              {/* Transition List */}
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {automaton.transitions.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                    No transitions yet.
                  </p>
                ) : (
                  automaton.transitions.map((t, i) => (
                    <div
                      key={`${t.from}-${t.symbol}-${t.to}-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(59, 130, 246, 0.15)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                      }}
                    >
                      <span>
                        <span style={{ color: '#10b981' }}>{t.from}</span>
                        <span style={{ color: '#64748b' }}> —</span>
                        <span style={{ color: '#f59e0b' }}>{t.symbol}</span>
                        <span style={{ color: '#64748b' }}>→ </span>
                        <span style={{ color: '#3b82f6' }}>{t.to}</span>
                      </span>
                      <button
                        onClick={() => onRemoveTransition(t.from, t.to, t.symbol)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '4px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
