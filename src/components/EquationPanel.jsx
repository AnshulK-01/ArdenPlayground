import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronDown, Zap, Target, Wand2, Trophy } from 'lucide-react';
import katex from 'katex';

function renderLatex(latex) {
  try {
    return { __html: katex.renderToString(latex, { throwOnError: false, displayMode: false }) };
  } catch {
    return { __html: latex };
  }
}

const stepIcons = {
  1: Zap,
  2: Target,
  3: Wand2,
  4: Sparkles,
  5: Trophy,
};

const stepColors = {
  1: '#3b82f6',
  2: '#f59e0b',
  3: '#06b6d4',
  4: '#1d4ed8',
  5: '#10b981',
};

export default function EquationPanel({ ardenResult, isVisible }) {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!isVisible || !ardenResult) return null;

  const { steps, finalRegex } = ardenResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass"
      style={{ borderRadius: '12px', overflow: 'hidden' }}
    >
      <div className="panel-header" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
        <Sparkles size={14} color="#3b82f6" />
        <span>Arden's Theorem — Step-by-Step</span>
      </div>

      <div style={{ padding: '12px' }}>
        {/* Timeline */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
          {steps.map((step, i) => (
            <div
              key={step.id}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: expandedStep === null || expandedStep >= i
                  ? stepColors[step.id] || '#3b82f6'
                  : 'rgba(59, 130, 246, 0.1)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Steps */}
        {steps.map((step, i) => {
          const Icon = stepIcons[step.id] || Zap;
          const color = stepColors[step.id] || '#6366f1';
          const isExpanded = expandedStep === i;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ marginBottom: '8px' }}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isExpanded ? color + '40' : 'rgba(59, 130, 246, 0.08)'}`,
                  background: isExpanded ? color + '10' : 'rgba(0, 0, 0, 0.4)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>
                    Step {step.id}: {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {step.description}
                  </div>
                </div>
                {isExpanded ? <ChevronDown size={14} color="#64748b" /> : <ChevronRight size={14} color="#64748b" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '12px', paddingLeft: '52px' }}>
                      {/* Equations step */}
                      {step.type === 'equations' && step.equations.map((eq, j) => (
                        <div
                          key={j}
                          style={{
                            padding: '6px 10px',
                            marginBottom: '4px',
                            borderRadius: '6px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: `1px solid ${eq.isRecursive ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.08)'}`,
                            fontFamily: 'JetBrains Mono',
                            fontSize: '12px',
                          }}
                        >
                          <span dangerouslySetInnerHTML={renderLatex(
                            `${eq.state} = ${eq.expression.replace(/ε/g, '\\varepsilon').replace(/∅/g, '\\emptyset')}`
                          )} />
                          {eq.isRecursive && (
                            <span style={{ marginLeft: '8px', fontSize: '10px', color: '#f59e0b', fontFamily: 'Inter' }}>
                              ← recursive
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Detection step */}
                      {step.type === 'detection' && (
                        step.recursiveStates.length > 0 ? step.recursiveStates.map((rs, j) => (
                          <div key={j} style={{ padding: '8px 10px', marginBottom: '4px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>
                              State {rs.state} has self-reference
                            </div>
                            <div style={{ fontFamily: 'JetBrains Mono', color: '#94a3b8' }}>
                              Recursive term: {rs.recursiveTerm}
                            </div>
                          </div>
                        )) : (
                          <p style={{ color: '#64748b', fontSize: '12px' }}>No recursive equations found.</p>
                        )
                      )}

                      {/* Comparison step */}
                      {step.type === 'comparison' && step.comparisons.map((c, j) => (
                        <div key={j} style={{ padding: '8px 10px', marginBottom: '4px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', fontSize: '12px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', marginBottom: '4px', color: '#94a3b8' }}>
                            {c.original}
                          </div>
                          <div style={{ color: '#06b6d4', fontWeight: 600 }}>
                            ↳ {c.ardenForm}
                          </div>
                        </div>
                      ))}

                      {/* Transformation step */}
                      {step.type === 'transformation' && step.transformations.map((t, j) => (
                        <div key={j} style={{ padding: '8px 10px', marginBottom: '4px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', fontSize: '12px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', color: '#64748b', textDecoration: t.appliedArden ? 'line-through' : 'none' }}>
                            {t.before}
                          </div>
                          {t.appliedArden && (
                            <div style={{ fontFamily: 'JetBrains Mono', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
                              ⟹ {t.after}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Result step */}
                      {step.type === 'result' && (
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Regular Expression
                          </div>
                          <div style={{ fontSize: '18px', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                            <span dangerouslySetInnerHTML={renderLatex(
                              step.finalRegex.replace(/ε/g, '\\varepsilon').replace(/∅/g, '\\emptyset')
                            )} />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Final RE Banner */}
        {finalRegex && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.15))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Final Regular Expression
            </div>
            <div style={{ fontSize: '22px', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
              <span dangerouslySetInnerHTML={renderLatex(
                finalRegex.replace(/ε/g, '\\varepsilon').replace(/∅/g, '\\emptyset')
              )} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
