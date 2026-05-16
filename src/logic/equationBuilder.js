/**
 * Equation Builder
 * Generates state equations from a finite automaton's transitions.
 */

/**
 * Builds state equations from the automaton definition.
 * Each equation is of the form: qi = sum of (qj . symbol) for all incoming transitions.
 * The start state also gets ε (epsilon) added.
 *
 * @param {Object} automaton - { states, transitions, startState, finalStates }
 * @returns {Array} equations - Array of { state, terms: [{ coefficient, symbol }], raw }
 */
export function buildStateEquations(automaton) {
  const { states, transitions, startState } = automaton;

  if (!states || states.length === 0) return [];

  const equations = [];

  for (const state of states) {
    const terms = [];

    // Find all incoming transitions to this state
    const incoming = transitions.filter((t) => t.to === state);

    // Group by source state
    const groupedBySource = {};
    for (const t of incoming) {
      if (!groupedBySource[t.from]) {
        groupedBySource[t.from] = [];
      }
      groupedBySource[t.from].push(t.symbol);
    }

    // Build terms
    for (const [source, symbols] of Object.entries(groupedBySource)) {
      for (const symbol of symbols) {
        terms.push({
          coefficient: source,
          symbol: symbol,
        });
      }
    }

    // Add epsilon for start state
    const hasEpsilon = state === startState;

    // Build raw string representation
    let rawParts = [];
    if (hasEpsilon) {
      rawParts.push('ε');
    }
    for (const term of terms) {
      rawParts.push(`${term.coefficient}.${term.symbol}`);
    }

    equations.push({
      state,
      terms,
      hasEpsilon,
      raw: rawParts.length > 0 ? rawParts.join(' + ') : '∅',
      isRecursive: terms.some((t) => t.coefficient === state),
    });
  }

  return equations;
}

/**
 * Formats an equation for display.
 * @param {Object} eq
 * @returns {string}
 */
export function formatEquation(eq) {
  return `${eq.state} = ${eq.raw}`;
}

/**
 * Converts equation to LaTeX format for KaTeX rendering.
 * @param {Object} eq
 * @returns {string}
 */
export function equationToLatex(eq) {
  let parts = [];

  if (eq.hasEpsilon) {
    parts.push('\\varepsilon');
  }

  for (const term of eq.terms) {
    parts.push(`${term.coefficient} \\cdot ${term.symbol}`);
  }

  const rhs = parts.length > 0 ? parts.join(' + ') : '\\emptyset';
  return `${eq.state} = ${rhs}`;
}
