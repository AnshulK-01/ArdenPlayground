import { motion } from 'framer-motion';
import { Table as TableIcon } from 'lucide-react';
import { buildTransitionTable } from '../utils/graphHelpers';

/**
 * Premium Transition Table
 * Format: Standard DFA table with notation (→, *)
 */
export default function TransitionTable({ automaton }) {
  const { headers, rows } = buildTransitionTable(automaton);

  if (rows.length === 0) return (
    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
      Define states to view the transition matrix.
    </div>
  );

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#3b82f6',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: 'JetBrains Mono',
                    borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  {h === 'State' ? 'δ' : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.state}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  borderBottom: '1px solid rgba(59, 130, 246, 0.05)',
                  background: (row.isStart || row.isFinal) ? 'rgba(59, 130, 246, 0.02)' : 'transparent',
                }}
              >
                <td
                  style={{
                    padding: '12px 16px',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    color: '#f8fafc',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', color: '#10b981' }}>{row.isStart ? '→' : ''}</span>
                    <span style={{ width: '12px', color: '#3b82f6' }}>{row.isFinal ? '*' : ''}</span>
                    {row.state}
                  </span>
                </td>
                {automaton.alphabet.map((symbol) => (
                  <td
                    key={symbol}
                    style={{
                      padding: '12px 16px',
                      fontFamily: 'JetBrains Mono',
                      color: row[symbol] === '—' ? '#334155' : '#cbd5e1',
                    }}
                  >
                    {row[symbol]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
