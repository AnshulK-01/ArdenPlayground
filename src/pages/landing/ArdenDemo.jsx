import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import katex from 'katex';

function tex(latex) {
  try { return katex.renderToString(latex, { throwOnError: false }); }
  catch { return latex; }
}

const demoSteps = [
  { label: 'Original Equation', latex: 'q_2 = q_0 \\cdot b + q_1 \\cdot a + q_2 \\cdot a', highlight: null },
  { label: 'Identify Recursive Term', latex: 'q_2 = q_0 \\cdot b + q_1 \\cdot a + \\boxed{q_2 \\cdot a}', highlight: 'q₂·a' },
  { label: 'Match Arden Form', latex: 'R = Q + R \\cdot P', note: 'R = q₂,  Q = q₀·b + q₁·a,  P = a' },
  { label: 'Apply Theorem', latex: 'R = Q \\cdot P^*', note: 'Eliminate recursion' },
  { label: 'Result', latex: 'q_2 = (q_0 \\cdot b + q_1 \\cdot a) \\cdot a^*', highlight: 'solved' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function ArdenDemo() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % demoSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="landing-section grid-bg">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.1 }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-label" style={{ textAlign: 'center' }}>Live Demo</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Step-by-Step Arden Derivation</h2>
          <p className="section-desc" style={{ textAlign: 'center', margin: '0 auto' }}>
            Watch Arden's Theorem transform a recursive equation into a closed-form regular expression.
          </p>
        </motion.div>

        {/* Step indicators */}
        <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {demoSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === activeStep ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                boxShadow: i === activeStep ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </motion.div>

        {/* Main display */}
        <motion.div variants={fadeUp} style={{ maxWidth: '700px', margin: '0 auto' }}>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="math-display glow-blue-strong"
            style={{ padding: '40px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>
              {demoSteps[activeStep].label}
            </div>
            <div
              style={{ fontSize: '28px', color: activeStep === demoSteps.length - 1 ? '#10b981' : '#e2e8f0', marginBottom: demoSteps[activeStep].note ? '16px' : '0' }}
              dangerouslySetInnerHTML={{ __html: tex(demoSteps[activeStep].latex) }}
            />
            {demoSteps[activeStep].note && (
              <div style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'JetBrains Mono', marginTop: '12px' }}>
                {demoSteps[activeStep].note}
              </div>
            )}
            {demoSteps[activeStep].highlight === 'solved' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '4px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Zap size={12} color="#10b981" />
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Recursion Eliminated</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
