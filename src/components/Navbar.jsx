import { motion } from 'framer-motion';
import { Cpu, ChevronDown, Sparkles, Trash2, Download, BookOpen, Layers } from 'lucide-react';
import { sampleDFAs } from '../examples/sampleDFAs';

/**
 * Premium Minimal Navbar
 * Features: Futuristic glassmorphism, glowing hover effects, compact actions.
 */
export default function Navbar({ onLoadExample, onSolveArden, onClear, onExportPNG, currentExample }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong"
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        zIndex: 1000,
        flexShrink: 0,
        background: 'rgba(2, 6, 23, 0.8)',
      }}
    >
      {/* Brand Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          // style={{
          //   width: '40px',
          //   height: '40px',
          //   borderRadius: '12px',
          //   background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
          // }}
        >
          <Layers size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', color: '#f8fafc', lineHeight: 1 }}>
            ARDEN'S <span style={{ color: '#3b82f6' }}>PLAYGROUND</span>
          </h1>
          <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', fontWeight: 600 }}>
            FA to RE by Arden's Theorem
          </p>
        </div>
      </div>

      {/* Action Center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Example Selector */}
        <div style={{ position: 'relative' }} className="group">
          <button className="btn-ghost" style={{ fontSize: '13px', fontWeight: 700, gap: '8px' }}>
            <BookOpen size={16} />
            Library
            <ChevronDown size={14} />
          </button>
          <div
            className="glass-strong animate-in fade-in zoom-in"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              borderRadius: '12px',
              padding: '8px',
              minWidth: '260px',
              display: 'none',
              zIndex: 1100,
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Standard Templates
            </div>
            {sampleDFAs.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onLoadExample(ex)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentExample === ex.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: currentExample === ex.id ? '#3b82f6' : '#e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  if (currentExample !== ex.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (currentExample !== ex.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{ex.name}</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{ex.description.slice(0, 30)}...</span>
              </button>
            ))}
          </div>
          <style>{`.group:hover > div:last-child { display: block !important; }`}</style>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Solve */}
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary" 
          onClick={onSolveArden} 
          style={{ fontSize: '13px', fontWeight: 800, padding: '10px 20px', gap: '8px' }}
        >
          <Sparkles size={16} fill="white" />
          SOLVE ARDEN
        </motion.button>

        {/* Export */}
        <button className="btn-ghost" onClick={onExportPNG} style={{ fontSize: '13px', fontWeight: 700, gap: '8px' }}>
          <Download size={16} />
          Snapshot
        </button>

        {/* Clear */}
        <button 
          className="btn-danger" 
          onClick={onClear} 
          style={{ 
            fontSize: '13px', 
            fontWeight: 800, 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '10px 16px'
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      
    </motion.nav>
  );
}
