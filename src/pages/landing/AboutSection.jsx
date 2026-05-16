import { motion } from 'framer-motion';
import { Cpu, GitBranch, Shuffle, Code2 } from 'lucide-react';

const concepts = [
  { icon: Cpu, title: 'DFA', subtitle: 'Deterministic Finite Automaton', desc: 'For every state and input symbol, there is exactly one transition. Used in lexical analyzers and pattern matching.', color: '#3b82f6' },
  { icon: GitBranch, title: 'NFA', subtitle: 'Non-deterministic Finite Automaton', desc: 'Allows multiple transitions for a single input, including transitions to multiple states simultaneously.', color: '#8b5cf6' },
  { icon: Shuffle, title: 'ε-NFA', subtitle: 'Epsilon NFA', desc: 'Extends NFA with epsilon transitions — state changes without consuming any input symbol.', color: '#0ea5e9' },
  { icon: Code2, title: 'Regular Expressions', subtitle: 'Regex / RE', desc: 'Algebraic notation for describing regular languages. Equivalent in power to finite automata.', color: '#f59e0b' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function AboutSection() {
  return (
    <section className="landing-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.1 }}>
        <motion.div variants={fadeUp}>
          <div className="section-label">Foundation</div>
          <h2 className="section-title">What is Automata Theory?</h2>
          <p className="section-desc" style={{ marginBottom: '24px' }}>
            Automata Theory is a branch of theoretical computer science that studies abstract computational machines and the problems they can solve.
          </p>
          <p className="section-desc" style={{ marginBottom: '60px', fontSize: '15px' }}>
            It forms the mathematical foundation of compilers, regular expressions, lexical analyzers, parsers, formal languages, and modern AI systems.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {concepts.map((c, i) => (
            <motion.div key={i} variants={fadeUp} className="concept-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${c.color}15`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon size={18} color={c.color} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{c.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{c.subtitle}</div>
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
