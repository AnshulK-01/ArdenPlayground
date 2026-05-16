import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const DFA_NODES = [
  { id: 'q0', x: 80, y: 140, label: 'q₀' },
  { id: 'q1', x: 260, y: 80, label: 'q₁' },
  { id: 'q2', x: 440, y: 140, label: 'q₂', final: true },
];

const DFA_EDGES = [
  { from: 'q0', to: 'q0', label: 'b', self: true },
  { from: 'q0', to: 'q1', label: 'a' },
  { from: 'q1', to: 'q0', label: 'a' },
  { from: 'q1', to: 'q2', label: 'b' },
  { from: 'q2', to: 'q0', label: 'b' },
  { from: 'q2', to: 'q1', label: 'a' },
];

function getNode(id) { return DFA_NODES.find(n => n.id === id); }

export default function HeroSection({ onLaunch }) {
  const [activeNode, setActiveNode] = useState('q0');
  const [step, setStep] = useState(0);
  const traversal = ['q0', 'q1', 'q2']; // simulating "ab"

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        const next = (prev + 1) % traversal.length;
        setActiveNode(traversal[next]);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient Orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '80px', zIndex: 10 }}>
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '20px',
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginBottom: '24px'
            }}
          >
            <Sparkles size={12} /> AI-Powered Automata Laboratory
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05,
            background: 'linear-gradient(135deg, #ffffff, #3b82f6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '20px'
          }}>
            Arden's<br />Playground
          </h1>

          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '520px', marginBottom: '36px' }}>
            Build finite automata visually, simulate strings, derive regular expressions using Arden's Theorem, and learn formal language theory interactively.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-launch btn-launch-primary"
              onClick={onLaunch}
            >
              Launch Playground <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-launch btn-launch-secondary"
              onClick={onLaunch}
            >
              <Play size={14} /> Explore Examples
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Animated DFA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            width: '520px', height: '280px', position: 'relative',
            background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.08)',
          }}>
            {/* SVG edges */}
            <svg width="520" height="280" style={{ position: 'absolute', top: 0, left: 0 }}>
              {DFA_EDGES.filter(e => !e.self).map((edge, i) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2 - 25;
                const isActive = activeNode === edge.from;
                return (
                  <g key={i}>
                    <path
                      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                      fill="none"
                      stroke={isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.2)'}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text x={mx} y={my - 4} fill="#60a5fa" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">{edge.label}</text>
                  </g>
                );
              })}
              {/* Start arrow */}
              <line x1="20" y1="140" x2="52" y2="140" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {DFA_NODES.map(node => (
              <motion.div
                key={node.id}
                animate={{
                  scale: activeNode === node.id ? 1.15 : 1,
                  boxShadow: activeNode === node.id ? '0 0 25px rgba(59, 130, 246, 0.5)' : '0 0 0px transparent',
                }}
                transition={{ duration: 0.4 }}
                className={`dfa-node ${node.final ? 'final' : ''}`}
                style={{
                  position: 'absolute',
                  left: node.x - 28, top: node.y - 28,
                  background: activeNode === node.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                }}
              >
                {node.label}
              </motion.div>
            ))}

            {/* Label */}
            <div style={{
              position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono',
            }}>
              DFA: strings ending with "ab"
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
