import { ExternalLink, BookOpen, FileText, Info } from 'lucide-react';

const links = [
  { label: 'About', icon: Info },
  { label: 'Documentation', icon: FileText },
  { label: 'GitHub', icon: ExternalLink },
  { label: 'Learn Automata', icon: BookOpen },
];

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>Arden's Playground</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Built for learning formal languages and automata theory interactively.</div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {links.map((l, i) => (
            <a key={i} href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              // onMouseEnter={e => e.target.style.color = '#3b82f6'}
              // onMouseLeave={e => e.target.style.color = '#64748b'}
            >
              <l.icon size={13} /> {l.label}
            </a>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', borderTop: '1px solid rgba(59, 130, 246, 0.08)', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#475569' }}>
        © 2026 Build by CSE-AIML Students (Anshul, Dhananjya, Abhinaw, Ritik), JSSUN'28.
      </div>
    </footer>
  );
}
