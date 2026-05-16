import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AutomataCanvas from './components/AutomataCanvas';
import ControlBar from './components/ControlBar';
import LabSidebar from './components/LabSidebar';
import ArdenTimeline from './components/ArdenTimeline';
import AIChat from './components/AIChat';
import { solveArden } from './logic/ardenSolver';
import { sampleDFAs } from './examples/sampleDFAs';
import { toPng } from 'html-to-image';
import { simulateDFA } from './logic/simulator';

const EMPTY_AUTOMATON = {
  states: [],
  alphabet: [],
  transitions: [],
  startState: null,
  finalStates: [],
};

export default function App() {
  const [automaton, setAutomaton] = useState(EMPTY_AUTOMATON);
  const [positions, setPositions] = useState({});
  const [ardenResult, setArdenResult] = useState(null);
  const [showArden, setShowArden] = useState(false);
  const [currentExample, setCurrentExample] = useState(null);
  const [highlightedState, setHighlightedState] = useState(null);
  const [highlightedEdge, setHighlightedEdge] = useState(null); // { from, to }
  const [chatOpen, setChatOpen] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const updateAlphabet = (transitions) => {
    const symbols = [...new Set(transitions.map((t) => t.symbol))];
    return symbols.sort();
  };

  // --- Handlers for ControlBar ---
  const handleAddState = useCallback((name) => {
    if (name && !automaton.states.includes(name)) {
      setAutomaton((prev) => {
        const newStates = [...prev.states, name];
        return { ...prev, states: newStates, startState: prev.startState || name };
      });
      setPositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[name]; // Force re-layout
        return newPositions;
      });
    }
  }, [automaton.states]);

  const handleAddTransition = useCallback((from, to, symbol) => {
    setAutomaton((prev) => {
      if (prev.transitions.some((t) => t.from === from && t.to === to && t.symbol === symbol)) return prev;
      const newTransitions = [...prev.transitions, { from, to, symbol }];
      return { ...prev, transitions: newTransitions, alphabet: updateAlphabet(newTransitions) };
    });
    setShowArden(false);
  }, []);

  const handleToggleFinal = useCallback((state) => {
    setAutomaton((prev) => ({
      ...prev,
      finalStates: prev.finalStates.includes(state)
        ? prev.finalStates.filter((s) => s !== state)
        : [...prev.finalStates, state],
    }));
  }, []);

  const handleTestString = useCallback(async (input) => {
    if (!automaton.startState) return alert("Define a start state first!");
    
    setIsTestLoading(true);
    const result = simulateDFA(automaton, input);
    
    // Initial state highlight
    setHighlightedState(automaton.startState);
    await new Promise(r => setTimeout(r, 600));

    // Animate steps
    for (const step of result.steps) {
      setHighlightedEdge({ from: step.from, to: step.to });
      await new Promise(r => setTimeout(r, 400));
      setHighlightedState(step.to);
      setHighlightedEdge(null);
      await new Promise(r => setTimeout(r, 600));
    }
    
    setHighlightedState(null);
    setHighlightedEdge(null);
    setIsTestLoading(false);
  }, [automaton]);

  // --- Navbar Actions ---
  const loadExample = useCallback((example) => {
    setAutomaton(example.automaton);
    setPositions(example.positions || {});
    setCurrentExample(example.id);
    setShowArden(false);
    setArdenResult(null);
  }, []);

  const handleSolveArden = useCallback(() => {
    if (automaton.states.length === 0 || !automaton.startState) return;
    const result = solveArden(automaton);
    setArdenResult(result);
    setShowArden(true);
  }, [automaton]);

  const handleClear = useCallback(() => {
    setAutomaton(EMPTY_AUTOMATON);
    setPositions({});
    setArdenResult(null);
    setShowArden(false);
    setCurrentExample(null);
  }, []);

  const handleExportPNG = useCallback(() => {
    const element = document.querySelector('.react-flow');
    if (!element) return;
    toPng(element, { backgroundColor: '#000000', style: { borderRadius: '0' } })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'automaton.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <Navbar
        onLoadExample={loadExample}
        onSolveArden={handleSolveArden}
        onClear={handleClear}
        onExportPNG={handleExportPNG}
        currentExample={currentExample}
      />

      <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {/* Main Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Example Banner */}
            <AnimatePresence>
              {currentExample && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 20, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
                >
                  <div className="glass" style={{ padding: '8px 20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '12px' }}>EXAMPLE LOADED</span>
                    <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ color: '#e2e8f0', fontSize: '12px' }}>{sampleDFAs.find(ex => ex.id === currentExample)?.name}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Automata Canvas */}
            <div style={{ width: '100%', height: '100%' }}>
              <AutomataCanvas
                automaton={automaton}
                positions={positions}
                onPositionChange={(id, pos) => setPositions(prev => ({ ...prev, [id]: pos }))}
                highlightedState={highlightedState}
                highlightedEdge={highlightedEdge}
              />
            </div>
          </div>

          {/* Dynamic Bottom Area: ControlBar or Arden Equations */}
          <div style={{ flexShrink: 0 }}>
            {showArden ? (
              <ArdenTimeline ardenResult={ardenResult} isVisible={showArden} onExit={() => setShowArden(false)} />
            ) : (
              <ControlBar 
                automaton={automaton}
                onAddState={handleAddState}
                onAddTransition={handleAddTransition}
                onToggleFinal={handleToggleFinal}
                onTestString={handleTestString}
                isTestLoading={isTestLoading}
              />
            )}
          </div>
        </div>

        {/* Right Lab Sidebar */}
        <LabSidebar 
          automaton={automaton} 
          onHighlight={(state) => setHighlightedState(state)} 
        />
      </div>

      {/* AI Assistant - Floating Chat Toggle (since we removed it from toolbar) */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: chatOpen ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          color: '#3b82f6'
        }}
      >
        <AIChat automaton={automaton} isOpen={chatOpen} onToggle={() => setChatOpen(false)} iconOnly />
      </motion.button>
      
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            style={{
              position: 'absolute',
              bottom: '180px',
              left: '24px',
              width: '380px',
              height: '500px',
              zIndex: 1000,
              pointerEvents: 'all'
            }}
          >
            <AIChat automaton={automaton} isOpen={chatOpen} onToggle={() => setChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
