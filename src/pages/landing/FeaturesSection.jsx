import { motion } from 'framer-motion';
import { PenTool, PlayCircle, Wand2, Code2, Bot, Table2, Sparkles, Share2 } from 'lucide-react';

const features = [
  { icon: PenTool, title: 'Interactive DFA/NFA Builder', desc: 'Drag-and-drop graph editor with visual state and transition management.' },
  { icon: PlayCircle, title: 'String Simulation Engine', desc: 'Animate input string traversal with highlighted states and transitions.' },
  { icon: Wand2, title: 'Arden Equation Generator', desc: 'Auto-generates state equations from your transition function.' },
  { icon: Code2, title: 'Regular Expression Generator', desc: 'Derives the equivalent RE with a full step-by-step pipeline.' },
  { icon: Sparkles, title: 'Step-by-Step Arden Solver', desc: 'Visual derivation showing substitution, detection, and theorem application.' },
  { icon: Table2, title: 'Transition Tables', desc: 'View your automaton as a structured transition table alongside the graph.' },
  { icon: Bot, title: 'AI Automata Tutor', desc: 'Integrated Gemini-powered AI that answers TAFL questions in real-time.' },
  { icon: Share2, title: 'Animated Graph Visualization', desc: 'Smooth edge curves, self-loops, and bidirectional transitions rendered in SVG.' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function FeaturesSection() {
  return (
    <section className="landing-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.06 }}>
        <motion.div variants={fadeUp}>
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">Features</h2>
          <p className="section-desc" style={{ marginBottom: '60px' }}>
            Everything you need to build, test, and understand finite automata — in one place.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="feature-card" style={{ padding: '22px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <f.icon size={16} color="#3b82f6" />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>{f.title}</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
