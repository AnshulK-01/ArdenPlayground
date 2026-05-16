/**
 * Arden's Theorem Solver
 *
 * Implements Arden's Theorem: If R = Q + RP, then R = QP*
 * Solves state equations step-by-step to derive a regular expression.
 */

import { buildStateEquations } from './equationBuilder';

/**
 * Main solver: takes an automaton and produces step-by-step Arden derivation.
 * @param {Object} automaton
 * @returns {Object} { steps, finalRegex, equations }
 */
export function solveArden(automaton) {
  const { states, transitions, startState, finalStates } = automaton;
  const steps = [];

  if (!startState || states.length === 0) {
    return { steps: [], finalRegex: '∅', equations: [] };
  }

  // Step 1: Build State Equations
  const equations = buildStateEquations(automaton);
  steps.push({
    id: 1,
    title: 'Build State Equations',
    description:
      'Generate equations for each state based on incoming transitions.',
    equations: equations.map((eq) => ({
      state: eq.state,
      expression: eq.raw,
      isRecursive: eq.isRecursive,
    })),
    type: 'equations',
  });

  // Create a mutable equation system: state -> expression string
  const eqSystem = {};
  for (const eq of equations) {
    eqSystem[eq.state] = eq.raw;
  }

  // Step 2: Identify recursive equations
  const recursiveStates = equations.filter((eq) => eq.isRecursive);
  steps.push({
    id: 2,
    title: 'Detect Recursive Equations',
    description:
      'Identify equations where a state appears on both sides (self-loop).',
    recursiveStates: recursiveStates.map((eq) => ({
      state: eq.state,
      expression: eq.raw,
      recursiveTerm: eq.terms
        .filter((t) => t.coefficient === eq.state)
        .map((t) => `${eq.state}.${t.symbol}`)
        .join(' + '),
    })),
    type: 'detection',
  });

  // Step 3: Substitution & Arden Application
  // We solve in reverse order (from last state to first), substituting as we go
  const resolved = {};
  const sortedStates = [...states]; // preserve order

  const substitutionSteps = [];

  for (let i = sortedStates.length - 1; i >= 0; i--) {
    const state = sortedStates[i];
    const eq = equations.find((e) => e.state === state);
    if (!eq) continue;

    let expression = eq.raw;

    // Substitute already-resolved states
    for (const [resolvedState, resolvedExpr] of Object.entries(resolved)) {
      if (expression.includes(resolvedState)) {
        expression = substituteState(expression, resolvedState, resolvedExpr);
      }
    }

    // Check for self-reference (Arden's form: R = Q + R.P)
    const selfTerms = [];
    const otherTerms = [];
    const parts = expression.split(' + ').map((p) => p.trim());

    for (const part of parts) {
      if (part.startsWith(`${state}.`) || part.startsWith(`${state}`)) {
        const dotIdx = part.indexOf('.');
        if (dotIdx !== -1 && part.substring(0, dotIdx) === state) {
          selfTerms.push(part.substring(dotIdx + 1));
        } else if (part === state) {
          selfTerms.push('ε');
        } else {
          otherTerms.push(part);
        }
      } else {
        otherTerms.push(part);
      }
    }

    if (selfTerms.length > 0) {
      // Apply Arden's Theorem: R = Q + RP => R = QP*
      const P =
        selfTerms.length === 1
          ? selfTerms[0]
          : `(${selfTerms.join(' + ')})`;
      const Q =
        otherTerms.length === 0
          ? 'ε'
          : otherTerms.length === 1
            ? otherTerms[0]
            : `(${otherTerms.join(' + ')})`;

      const resolvedExpr = Q === 'ε' ? `${P}*` : `${Q}${P}*`;

      substitutionSteps.push({
        state,
        before: `${state} = ${expression}`,
        ardenForm: `R = Q + RP where R=${state}, Q=${Q}, P=${P}`,
        after: `${state} = ${resolvedExpr}`,
        appliedArden: true,
      });

      resolved[state] = resolvedExpr;
    } else {
      resolved[state] = expression;
      substitutionSteps.push({
        state,
        before: `${state} = ${expression}`,
        after: `${state} = ${expression}`,
        appliedArden: false,
      });
    }
  }

  steps.push({
    id: 3,
    title: "Compare with Arden's Form",
    description: 'Match each recursive equation to R = Q + RP form.',
    comparisons: substitutionSteps
      .filter((s) => s.appliedArden)
      .map((s) => ({
        state: s.state,
        original: s.before,
        ardenForm: s.ardenForm,
      })),
    type: 'comparison',
  });

  steps.push({
    id: 4,
    title: "Apply Arden's Theorem",
    description:
      "Transform recursive equations using Arden's Theorem: R = Q + RP ⟹ R = QP*",
    transformations: substitutionSteps.map((s) => ({
      state: s.state,
      before: s.before,
      after: s.after,
      appliedArden: s.appliedArden,
    })),
    type: 'transformation',
  });

  // Step 5: Final Regular Expression — combine final states
  let finalRegex = '∅';

  if (finalStates.length > 0) {
    const finalExpressions = finalStates
      .map((fs) => resolved[fs] || '∅')
      .filter((e) => e !== '∅');

    if (finalExpressions.length === 1) {
      finalRegex = finalExpressions[0];
    } else if (finalExpressions.length > 1) {
      finalRegex = finalExpressions.join(' + ');
    }
  }

  // Simplify the regex
  finalRegex = simplifyRegex(finalRegex);

  steps.push({
    id: 5,
    title: 'Final Regular Expression',
    description:
      'Combine expressions for all final/accepting states to get the final RE.',
    finalRegex,
    finalStates: finalStates.map((fs) => ({
      state: fs,
      expression: resolved[fs] || '∅',
    })),
    type: 'result',
  });

  return { steps, finalRegex, equations, resolved };
}

/**
 * Substitute a resolved state expression into an equation.
 */
function substituteState(expression, stateName, stateExpr) {
  // Replace "stateName.symbol" patterns
  const parts = expression.split(' + ').map((p) => p.trim());
  const newParts = [];

  for (const part of parts) {
    const dotIdx = part.indexOf('.');
    if (dotIdx !== -1) {
      const coeff = part.substring(0, dotIdx);
      const symbol = part.substring(dotIdx + 1);
      if (coeff === stateName) {
        // Replace coefficient with its expression
        if (stateExpr === 'ε') {
          newParts.push(symbol);
        } else if (stateExpr.includes('+')) {
          newParts.push(`(${stateExpr})${symbol}`);
        } else {
          newParts.push(`${stateExpr}${symbol}`);
        }
      } else {
        newParts.push(part);
      }
    } else if (part === stateName) {
      newParts.push(stateExpr);
    } else {
      newParts.push(part);
    }
  }

  return newParts.join(' + ');
}

/**
 * Basic regex simplification.
 */
function simplifyRegex(regex) {
  if (!regex) return '∅';

  let r = regex;

  // Remove unnecessary parentheses around single characters
  r = r.replace(/\(([a-zA-Z0-9εε])\)/g, '$1');

  // ε concatenation simplification
  r = r.replace(/ε\./g, '');
  r = r.replace(/\.ε/g, '');

  // Remove double stars
  r = r.replace(/\*\*/g, '*');

  return r || '∅';
}

/**
 * Convert an Arden step to LaTeX for rendering.
 */
export function stepToLatex(step) {
  if (step.type === 'equations') {
    return step.equations.map((eq) => {
      let expr = eq.expression
        .replace(/ε/g, '\\varepsilon')
        .replace(/\./g, ' \\cdot ')
        .replace(/∅/g, '\\emptyset');
      return `${eq.state} = ${expr}`;
    });
  }

  if (step.type === 'result') {
    let re = step.finalRegex
      .replace(/ε/g, '\\varepsilon')
      .replace(/∅/g, '\\emptyset');
    return [`RE = ${re}`];
  }

  return [];
}
