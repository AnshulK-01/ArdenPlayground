import { motion } from 'framer-motion';
import { ArrowLeftRight, ArrowRight } from 'lucide-react';
import katex from 'katex';

function tex(latex) {
  try { return katex.renderToString(latex, { throwOnError: false, displayMode: false }); }
  catch { return latex; }
}

const conversions = [
  { from: 'RE', to: 'ε-NFA', desc: "Thompson's Construction converts every regular expression into an equivalent ε-NFA systematically.", color: '#3b82f6' },
  { from: 'NFA', to: 'DFA', desc: 'Subset Construction (power set method) converts NFA to an equivalent DFA by tracking sets of states.', color: '#8b5cf6' },
  { from: 'DFA', to: 'RE', desc: "State Elimination or Arden's Theorem converts any DFA into an equivalent regular expression.", color: '#0ea5e9' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function KleenesSection() {
  return (
    <section className="landing-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.1 }}>
        <motion.div variants={fadeUp}>
          <div className="section-label">Equivalence</div>
          <h2 className="section-title">Kleene's Theorem</h2>
          <p className="section-desc" style={{ marginBottom: '32px' }}>
            Kleene's Theorem establishes the fundamental equivalence between finite automata and regular expressions — proving they describe exactly the same class of languages.
          </p>
        </motion.div>

        {/* Central equation */}
        <motion.div variants={fadeUp} className="math-display" style={{ marginBottom: '48px', maxWidth: '500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#3b82f6' }}>Regular Expression</span>
            <ArrowLeftRight size={28} color="#f59e0b" />
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#8b5cf6' }}>Finite Automata</span>
          </div>
        </motion.div>

        {/* Conversion cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {conversions.map((c, i) => (
            <motion.div key={i} variants={fadeUp} className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '6px 14px', borderRadius: '8px', background: `${c.color}15`, border: `1px solid ${c.color}25`, fontWeight: 800, fontSize: '14px', color: c.color }}>
                  {c.from}
                </div>
                <ArrowRight size={18} color="#64748b" />
                <div style={{ padding: '6px 14px', borderRadius: '8px', background: `${c.color}15`, border: `1px solid ${c.color}25`, fontWeight: 800, fontSize: '14px', color: c.color }}>
                  {c.to}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
