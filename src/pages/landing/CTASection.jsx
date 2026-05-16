import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function CTASection({ onLaunch }) {
  return (
    <section className="grid-bg" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-orb" style={{ width: '500px', height: '500px', background: '#3b82f6', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, filter: 'blur(120px)' }} />
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
        style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}
      >
        <motion.div variants={fadeUp}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px',
            background: 'linear-gradient(135deg, #f8fafc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Ready to Explore Automata Theory Interactively?
          </h2>
        </motion.div>
        <motion.p variants={fadeUp} style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '40px' }}>
          Build automata, visualize transitions, solve Arden equations, and generate regular expressions — all in one interactive playground.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-launch btn-launch-primary" onClick={onLaunch}>
            Launch Playground <ArrowRight size={16} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-launch btn-launch-secondary" onClick={onLaunch}>
            <BookOpen size={14} /> Explore Examples
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
