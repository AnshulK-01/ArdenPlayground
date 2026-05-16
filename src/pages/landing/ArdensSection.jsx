import { motion } from 'framer-motion';
import { Zap, ArrowRight, Equal } from 'lucide-react';
import katex from 'katex';

function tex(latex) {
  try { return katex.renderToString(latex, { throwOnError: false }); }
  catch { return latex; }
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const processSteps = [
  { num: '1', text: 'Build state equations from transitions' },
  { num: '2', text: 'Detect recursive expressions (self-loops)' },
  { num: '3', text: 'Compare with Arden form: R = Q + RP' },
  { num: '4', text: "Apply theorem: R = QP*" },
  { num: '5', text: 'Generate final Regular Expression' },
];

export default function ArdensSection() {
  return (
    <section className="landing-section grid-bg">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.1 }}>
        <motion.div variants={fadeUp}>
          <div className="section-label">Core Algorithm</div>
          <h2 className="section-title">Arden's Theorem</h2>
          <p className="section-desc" style={{ marginBottom: '40px' }}>
            Arden's Theorem provides an algebraic method to solve recursive regular equations and convert finite automata into regular expressions.
          </p>
        </motion.div>

        {/* Main theorem display */}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '24px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <div className="math-display glow-blue" style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', fontWeight: 600, letterSpacing: '1px' }}>RECURSIVE FORM</div>
            <div style={{ fontSize: '36px', color: '#f59e0b' }} dangerouslySetInnerHTML={{ __html: tex('R = Q + RP') }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ArrowRight size={32} color="#3b82f6" />
            </motion.div>
          </div>
          <div className="math-display glow-blue-strong" style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', fontWeight: 600, letterSpacing: '1px' }}>SOLVED FORM</div>
            <div style={{ fontSize: '36px', color: '#10b981' }} dangerouslySetInnerHTML={{ __html: tex('R = QP^*') }} />
          </div>
        </motion.div>

        {/* Worked example */}
        <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
          <div className="feature-card">
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '12px' }}>EXAMPLE EQUATION</div>
            <div style={{ fontSize: '20px', marginBottom: '16px', color: '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: tex('q_2 = q_0 \\cdot b + q_1 \\cdot a + q_2 \\cdot a') }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 700 }}>R</span>
                <Equal size={12} color="#64748b" />
                <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'JetBrains Mono' }}>q₂</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>Q</span>
                <Equal size={12} color="#64748b" />
                <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'JetBrains Mono' }}>q₀·b + q₁·a</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>P</span>
                <Equal size={12} color="#64748b" />
                <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'JetBrains Mono' }}>a</span>
              </div>
            </div>
          </div>
          <div className="feature-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginBottom: '12px' }}>RESULT</div>
            <div style={{ fontSize: '20px', color: '#10b981', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: tex('q_2 = (q_0 \\cdot b + q_1 \\cdot a) \\cdot a^*') }} />
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              The recursive term <span style={{ color: '#f59e0b' }}>q₂·a</span> is eliminated using Arden's Theorem, producing a non-recursive closed-form expression.
            </p>
          </div>
        </motion.div>

        {/* Process steps */}
        <motion.div variants={fadeUp}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '16px', letterSpacing: '1px' }}>THE PROCESS</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {processSteps.map((s, i) => (
              <motion.div
                key={i} variants={fadeUp}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(59, 130, 246, 0.1)', flex: '1 1 200px' }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.num}
                </div>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{s.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
