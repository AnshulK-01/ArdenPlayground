/**
 * DFA/NFA String Simulator
 * Simulates string traversal through a finite automaton step-by-step.
 */

/**
 * Simulates a DFA with step-by-step traversal.
 * @param {Object} automaton - { states, alphabet, transitions, startState, finalStates }
 * @param {string} inputString - The string to simulate
 * @returns {Object} - { accepted, path, steps, reason }
 */
export function simulateDFA(automaton, inputString) {
  const { states, transitions, startState, finalStates } = automaton;

  if (!startState) {
    return {
      accepted: false,
      path: [],
      steps: [],
      reason: 'No start state defined.',
    };
  }

  let currentState = startState;
  const path = [currentState];
  const steps = [];

  for (let i = 0; i < inputString.length; i++) {
    const symbol = inputString[i];

    // Find transition
    const transition = transitions.find(
      (t) => t.from === currentState && t.symbol === symbol
    );

    if (!transition) {
      steps.push({
        index: i,
        symbol,
        from: currentState,
        to: null,
        status: 'dead',
        message: `No transition from ${currentState} on symbol '${symbol}'. String is rejected (dead state).`,
      });

      return {
        accepted: false,
        path,
        steps,
        reason: `No transition defined from state '${currentState}' on input symbol '${symbol}'. The automaton enters a dead state.`,
      };
    }

    steps.push({
      index: i,
      symbol,
      from: currentState,
      to: transition.to,
      status: 'transition',
      message: `Read '${symbol}': ${currentState} → ${transition.to}`,
    });

    currentState = transition.to;
    path.push(currentState);
  }

  const accepted = finalStates.includes(currentState);

  return {
    accepted,
    path,
    steps,
    reason: accepted
      ? `The string ends in state '${currentState}', which is a final/accepting state. Therefore, the string is ACCEPTED.`
      : `The string ends in state '${currentState}', which is NOT a final/accepting state. Therefore, the string is REJECTED.`,
  };
}

/**
 * Simulates an NFA with step-by-step traversal (follows all paths).
 * @param {Object} automaton
 * @param {string} inputString
 * @returns {Object}
 */
export function simulateNFA(automaton, inputString) {
  const { transitions, startState, finalStates } = automaton;

  if (!startState) {
    return {
      accepted: false,
      path: [],
      steps: [],
      reason: 'No start state defined.',
    };
  }

  let currentStates = new Set([startState]);
  const steps = [];
  const path = [Array.from(currentStates)];

  for (let i = 0; i < inputString.length; i++) {
    const symbol = inputString[i];
    const nextStates = new Set();

    for (const state of currentStates) {
      const matchingTransitions = transitions.filter(
        (t) => t.from === state && t.symbol === symbol
      );
      matchingTransitions.forEach((t) => nextStates.add(t.to));
    }

    steps.push({
      index: i,
      symbol,
      from: Array.from(currentStates),
      to: Array.from(nextStates),
      status: nextStates.size > 0 ? 'transition' : 'dead',
      message:
        nextStates.size > 0
          ? `Read '${symbol}': {${Array.from(currentStates).join(', ')}} → {${Array.from(nextStates).join(', ')}}`
          : `No transitions from {${Array.from(currentStates).join(', ')}} on '${symbol}'`,
    });

    if (nextStates.size === 0) {
      return {
        accepted: false,
        path,
        steps,
        reason: `All computation paths died. No transition available from any active state on symbol '${symbol}'.`,
      };
    }

    currentStates = nextStates;
    path.push(Array.from(currentStates));
  }

  const accepted = Array.from(currentStates).some((s) =>
    finalStates.includes(s)
  );

  return {
    accepted,
    path,
    steps,
    reason: accepted
      ? `At least one computation path ends in a final state. The string is ACCEPTED by the NFA.`
      : `No computation path ends in a final state. The string is REJECTED.`,
  };
}
