import { motion } from 'framer-motion';
import { Bot, Sparkles, User, Send } from 'lucide-react';

const chatMessages = [
  { role: 'user', text: 'What is the difference between DFA and NFA?' },
  { role: 'bot', text: 'A **DFA** has exactly one transition per state per input symbol, while an **NFA** can have zero, one, or many transitions — including ε-transitions. Both recognize the same class of regular languages.' },
  { role: 'user', text: "Explain Arden's theorem simply." },
  { role: 'bot', text: "If a state equation looks like **R = Q + RP**, you can solve it as **R = QP***. It removes the self-reference by introducing the Kleene star on the recursive part." },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function AISection() {
  return (
    <section className="landing-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} transition={{ staggerChildren: 0.1 }}>
        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Left: Text */}
          <motion.div variants={fadeUp} style={{ flex: 1, minWidth: '300px' }}>
            <div className="section-label">Intelligence</div>
            <h2 className="section-title">AI-Powered Automata Assistant</h2>
            <p className="section-desc" style={{ marginBottom: '28px' }}>
              An integrated AI tutor powered by Google Gemini that answers your questions about DFA, NFA, regular expressions, Arden's Theorem, and formal languages — right inside the playground.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['What is the difference between DFA and NFA?', "Explain Arden's theorem simply.", 'Why is this string rejected?', 'How is this regular expression generated?'].map((q, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#94a3b8', padding: '8px 14px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.08)' }}>
                  "{q}"
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Chat Mock */}
          <motion.div variants={fadeUp} style={{ flex: 1, minWidth: '340px', display: 'flex', justifyContent: 'center' }}>
            <div className="chat-mock" style={{ width: '100%', maxWidth: '440px' }}>
              <div className="chat-mock-header">
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={13} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Padhne Wala Baccha</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>AI Tutor • Online</div>
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '8px' }}
                  >
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: msg.role === 'user' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {msg.role === 'user' ? <User size={11} color="white" /> : <Bot size={11} color="white" />}
                    </div>
                    <div className={msg.role === 'user' ? 'chat-mock-msg chat-mock-user' : 'chat-mock-msg chat-mock-bot'}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#64748b' }}>
                  Ask about automata...
                </div>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={13} color="white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
