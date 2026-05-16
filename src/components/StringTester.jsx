import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, ChevronRight, Activity } from 'lucide-react';
import { simulateDFA } from '../logic/simulator';

/**
 * Premium String Tester
 * Features: Animated traversal, neon indicators, path visualization.
 */
export default function StringTester({ automaton, onHighlight }) {
  const [inputString, setInputString] = useState('');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSimulate = async () => {
    if (!automaton.startState) return;
    const simResult = simulateDFA(automaton, inputString);
    setResult(simResult);
    setCurrentStep(-1);
    await animateSteps(simResult.path);
  };

  const animateSteps = async (path) => {
    setIsAnimating(true);
    for (let i = 0; i < path.length; i++) {
      setCurrentStep(i);
      onHighlight(path[i]); // Highlight node
      await new Promise((r) => setTimeout(r, 800));
    }
    onHighlight(null); // Clear highlight
    setIsAnimating(false);
  };

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            className="input-field"
            placeholder="Enter test string..."
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            style={{ 
              fontFamily: 'JetBrains Mono', 
              fontSize: '14px',
              padding: '12px 16px'
            }}
          />
          {isAnimating && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <Activity size={16} color="#3b82f6" />
            </motion.div>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={handleSimulate}
          disabled={isAnimating || !automaton.startState}
          style={{ padding: '0 20px', borderRadius: '10px' }}
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Visual Path */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(59, 130, 246, 0.1)'
              }}
            >
              {result.path.map((state, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <motion.div
                    animate={{ 
                      scale: i === currentStep ? 1.2 : 1,
                      borderColor: i === currentStep ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                      background: i === currentStep ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono',
                      border: '1px solid',
                      color: i <= currentStep ? '#f8fafc' : '#475569',
                    }}
                  >
                    {state}
                  </motion.div>
                  {i < result.path.length - 1 && (
                    <ChevronRight size={14} color="#334155" />
                  )}
                </div>
              ))}
            </div>

            {/* Final Verdict */}
            {!isAnimating && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: result.accepted 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${result.accepted ? '#10b98144' : '#ef444444'}`,
                }}
              >
                {result.accepted ? (
                  <CheckCircle size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 800, 
                    color: result.accepted ? '#10b981' : '#ef4444',
                    letterSpacing: '1px'
                  }}>
                    {result.accepted ? 'ACCEPTED' : 'REJECTED'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {result.reason}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
