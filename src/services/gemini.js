/**
 * Gemini AI Service for the Automata AI Assistant
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `You are "Padhne Wala Baccha", a TAFL expert. Be concise.`;

/**
 * Build context string from current automaton state
 */
function buildAutomatonContext(automaton) {
  if (!automaton || !automaton.states || automaton.states.length === 0) return '';
  return `\nContext: States(${automaton.states.join(',')})`;
}

/**
 * Send message to Gemini API
 */
export async function sendMessage(userMessage, automaton, history = []) {
  const currentKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  if (!currentKey) {
    return {
      success: false,
      message: 'API key missing. Restart server.',
    };
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(currentKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const contextStr = buildAutomatonContext(automaton);
    const fullPrompt = SYSTEM_PROMPT + contextStr;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'Hello, I need help with automata theory.' }] },
        { role: 'model', parts: [{ text: fullPrompt + '\n\nHello! I\'m Padhne Wala Baccha, ask me about TAFL. I can help you understand DFAs, NFAs, Arden\'s Theorem, regular expressions, and more. What would you like to learn about?' }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return { success: true, message: response };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      message: `AI Error: ${error.message}. Make sure your VITE_GEMINI_API_KEY is valid.`,
    };
  }
}
