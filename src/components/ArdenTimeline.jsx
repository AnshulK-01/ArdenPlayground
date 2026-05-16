import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Braces, Sparkles, Terminal, Zap, Search, ArrowRight } from 'lucide-react';
import katex from 'katex';

/**
 * Render a LaTeX string to HTML via KaTeX
 */
function tex(latex) {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode: false });
  } catch {
    return latex;
  }
}

/**
 * Convert a raw expression string to LaTeX
 */
function exprToLatex(expr) {
  if (!expr) return '\\emptyset';
  return expr
    .replace(/ε/g, '\\varepsilon')
    .replace(/∅/g, '\\emptyset')
    .replace(/\./g, ' \\cdot ')
    .replace(/\*/g, '^*');
}

/**
 * Arden Timeline Panel
 * Displays real equations, substitution steps, Arden's Theorem applications, and final RE.
 */
export default function ArdenTimeline({ ardenResult, isVisible, onExit }) {
  if (!isVisible || !ardenResult) return null;

  const { equations, steps, finalRegex } = ardenResult;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: '320px', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="glass-strong"
      style={{
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        background: '#0a0f1e'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(59, 130, 246, 0.05)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={14} color="#3b82f6" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Arden's Derivation Pipeline
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Equations: <b style={{ color: '#3b82f6' }}>{equations.length}</b>
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Steps: <b style={{ color: '#3b82f6' }}>{steps.length}</b>
          </span>
          <button
            onClick={onExit}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: '#64748b',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* Steps Horizontal Scroll */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflowX: 'auto',
          padding: '16px 20px',
          gap: '16px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
        }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              minWidth: step.type === 'transformation' ? '380px' : '340px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexShrink: 0 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step.type === 'transformation' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {step.id}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{step.title}</span>
            </div>

            {/* Step Content - Render actual equations based on type */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              scrollbarWidth: 'thin',
            }}>
              {step.type === 'equations' && step.equations && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {step.equations.map((eq, j) => (
                    <div key={j} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: eq.isRecursive ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.05)',
                      border: `1px solid ${eq.isRecursive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.08)'}`,
                    }}>
                      {eq.isRecursive && <Zap size={10} color="#f59e0b" style={{ flexShrink: 0 }} />}
                      <span
                        style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.6 }}
                        dangerouslySetInnerHTML={{ __html: tex(exprToLatex(`${eq.state} = ${eq.expression}`)) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {step.type === 'detection' && step.recursiveStates && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {step.recursiveStates.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                      No recursive (self-loop) equations found.
                    </div>
                  ) : (
                    step.recursiveStates.map((rs, j) => (
                      <div key={j} style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.15)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Search size={10} color="#f59e0b" />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b' }}>
                            Self-loop on {rs.state}
                          </span>
                        </div>
                        <span
                          style={{ fontSize: '13px', color: '#e2e8f0' }}
                          dangerouslySetInnerHTML={{ __html: tex(exprToLatex(`${rs.state} = ${rs.expression}`)) }}
                        />
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                          Recursive term: <span
                            dangerouslySetInnerHTML={{ __html: tex(exprToLatex(rs.recursiveTerm)) }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step.type === 'comparison' && step.comparisons && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {step.comparisons.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                      No equations match Arden's recursive form.
                    </div>
                  ) : (
                    step.comparisons.map((cmp, j) => (
                      <div key={j} style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.05)',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                      }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Original:</div>
                        <div
                          style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '6px' }}
                          dangerouslySetInnerHTML={{ __html: tex(exprToLatex(cmp.original)) }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ArrowRight size={10} color="#3b82f6" />
                          <span style={{ fontSize: '11px', color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace' }}>
                            {cmp.ardenForm}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step.type === 'transformation' && step.transformations && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {step.transformations.map((t, j) => (
                    <div key={j} style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: t.appliedArden ? 'rgba(245, 158, 11, 0.06)' : 'rgba(59, 130, 246, 0.04)',
                      border: `1px solid ${t.appliedArden ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.08)'}`,
                    }}>
                      <div
                        style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textDecoration: t.appliedArden ? 'line-through' : 'none' }}
                        dangerouslySetInnerHTML={{ __html: tex(exprToLatex(t.before)) }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowRight size={10} color={t.appliedArden ? '#f59e0b' : '#3b82f6'} />
                        <span
                          style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}
                          dangerouslySetInnerHTML={{ __html: tex(exprToLatex(t.after)) }}
                        />
                        {t.appliedArden && (
                          <span style={{
                            fontSize: '9px',
                            color: '#f59e0b',
                            background: 'rgba(245, 158, 11, 0.15)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}>
                            ARDEN
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step.type === 'result' && step.finalStates && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {step.finalStates.map((fs, j) => (
                    <div key={j} style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                    }}>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                        Final state {fs.state}:
                      </span>
                      <span
                        style={{ fontSize: '13px', color: '#e2e8f0', marginLeft: '8px' }}
                        dangerouslySetInnerHTML={{ __html: tex(exprToLatex(fs.expression)) }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
                <ChevronRight size={18} color="#334155" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Final Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: steps.length * 0.1 }}
          style={{
            minWidth: '380px',
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '2px solid #3b82f6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sparkles size={20} color="#f59e0b" />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px' }}>EQUIVALENT RE</span>
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#3b82f6',
              wordBreak: 'break-all',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
              lineHeight: 1.4,
            }}
            dangerouslySetInnerHTML={{ __html: tex(`\\large{${exprToLatex(finalRegex)}}`) }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
