import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Loader2, Sparkles, MessageSquare, X } from 'lucide-react';
import { sendMessage } from '../services/gemini';
import { marked } from 'marked';
import katex from 'katex';

// Configure marked for clean output
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Render markdown + LaTeX math into HTML
 */
function renderMessage(text) {
  // First, replace LaTeX math expressions with rendered HTML
  // Block math: $$...$$
  let html = text.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch { return `<code>${math}</code>`; }
  });
  // Inline math: $...$
  html = html.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch { return `<code>${math}</code>`; }
  });
  // Then render markdown
  html = marked.parse(html);
  return html;
}

const QUICK_PROMPTS = [
  'Explain this DFA',
  "What is Arden's Theorem?",
  'What is the difference between DFA and NFA?',
  'Explain regular expressions',
];

export default function AIChat({ automaton, isOpen, onToggle, iconOnly }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm Padhne Wala Baccha, ask me about TAFL.\n\nI can help you understand:\n- DFA & NFA concepts\n- Arden's Theorem step-by-step\n- Regular Expressions\n- Your current automaton\n\nAsk me anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Limit history to last 4 messages to save tokens and avoid quota issues
    const chatHistory = messages.slice(-4).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await sendMessage(msg, automaton, chatHistory);

    if (response.success) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);
    } else {
      // Handle Quota or API Errors gracefully in the UI
      let errorMessage = "⚠️ Oops! I'm sick rn...";
      
      if (response.message.includes('429')) {
        errorMessage = "🚨 [Uff, I'm tired now, let me do sleepy weepy] ";
      } else if (response.message.includes('API key missing')) {
        errorMessage = "Brain disconnected bruhh...";
      } else {
        errorMessage = "Sleeping rn, Don't disturb me 😴";
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMessage },
      ]);
    }
    setIsLoading(false);
  };

  if (iconOnly) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bot size={24} style={{ color: isOpen ? '#3b82f6' : '#94a3b8' }} />
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      className="glass-strong"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(59, 130, 246, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={14} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>Padhne Wala Baccha</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>of Sumendra Sir</div>
          </div>
        </div>
        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid rgba(59, 130, 246, 0.08)' }}>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              background: 'rgba(59, 130, 246, 0.05)',
              color: '#94a3b8',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.15)';
              e.target.style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.05)';
              e.target.style.color = '#94a3b8';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {msg.role === 'user' ? <User size={13} color="white" /> : <Bot size={13} color="white" />}
            </div>
            <div
              className={msg.role === 'assistant' ? 'chat-markdown' : ''}
              style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                background: msg.role === 'user'
                  ? 'rgba(6, 182, 212, 0.1)'
                  : 'rgba(59, 130, 246, 0.08)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.12)'}`,
                fontSize: '12px',
                lineHeight: 1.6,
                color: '#e2e8f0',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={
                msg.role === 'assistant'
                  ? { __html: renderMessage(msg.content) }
                  : { __html: msg.content }
              }
            />
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}
          >
            <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={13} color="white" />
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '4px 12px 12px 12px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.12)' }}>
              <Loader2 size={14} className="animate-spin" style={{ color: '#3b82f6' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(59, 130, 246, 0.15)', display: 'flex', gap: '6px' }}>
        <input
          className="input-field"
          placeholder="Ask about automata..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, fontSize: '12px' }}
        />
        <button
          className="btn-primary"
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          style={{ padding: '8px 12px', opacity: isLoading || !input.trim() ? 0.5 : 1 }}
        >
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
}
