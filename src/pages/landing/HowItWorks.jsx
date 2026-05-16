import { motion } from 'framer-motion';
import { PenTool, Link2, PlayCircle, FileText, Wand2, Code2 } from 'lucide-react';

const steps = [
  { icon: PenTool, title: 'Build Automata', desc: 'Create DFA/NFA visually using interactive graph controls. Add states with a click.', color: '#3b82f6' },
  { icon: Link2, title: 'Add Transitions', desc: 'Define transition symbols and connect states dynamically with labeled edges.', color: '#8b5cf6' },
  { icon: PlayCircle, title: 'Test Strings', desc: 'Simulate input strings and watch the automaton traverse states in real-time.', color: '#0ea5e9' },
  { icon: FileText, title: 'Generate Equations', desc: 'The platform automatically builds state equations from your transition graph.', color: '#f59e0b' },
  { icon: Wand2, title: "Apply Arden's Theorem", desc: 'Recursive equations are detected and simplified step-by-step using the theorem.', color: '#ec4899' },
  { icon: Code2, title: 'Get Regular Expression', desc: 'The final regular expression is produced and displayed with full derivation.', color: '#10b981' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function HowItWorks() {
  return (
    <section className="landing-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.08 }}>
        <motion.div variants={fadeUp}>
          <div className="section-label">Workflow</div>
          <h2 className="section-title">How the Platform Works</h2>
          <p className="section-desc" style={{ marginBottom: '60px' }}>
            From building your first automaton to generating a regular expression — in six intuitive steps.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="feature-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="step-number" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, width: '42px', height: '42px', fontSize: '16px', borderRadius: '12px' }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>{s.title}</div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
