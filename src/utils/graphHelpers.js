import dagre from 'dagre';

/**
 * Graph helper utilities for converting automaton data to React Flow format.
 */

const nodeWidth = 120;
const nodeHeight = 120;

/**
 * Automatic Layout using Dagre
 */
export function getLayoutedElements(nodes, edges, direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ rankdir: direction, ranksep: 200, nodesep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
}

/**
 * Convert automaton states to React Flow nodes.
 */
export function statesToNodes(states, startState, finalStates, positions = {}, highlightedState = null) {
  return states.map((state) => {
    const pos = positions[state] || { x: 0, y: 0 };

    return {
      id: state,
      type: 'automataNode',
      position: pos,
      data: {
        label: state,
        isStart: state === startState,
        isFinal: finalStates.includes(state),
        isHighlighted: state === highlightedState,
      },
    };
  });
}

/**
 * Convert automaton transitions to React Flow edges.
 * Groups parallel edges (same from/to) onto one label.
 */
export function transitionsToEdges(transitions, highlightedEdge = null) {
  // Group transitions by from-to pair
  const grouped = {};
  for (const t of transitions) {
    const key = `${t.from}->${t.to}`;
    if (!grouped[key]) {
      grouped[key] = { from: t.from, to: t.to, symbols: [] };
    }
    grouped[key].symbols.push(t.symbol);
  }

  return Object.entries(grouped).map(([key, group]) => {
    // Check if there's a reverse edge
    const reverseKey = `${group.to}->${group.from}`;
    const hasReverse = !!grouped[reverseKey] && group.from !== group.to;
    
    const isHL = highlightedEdge && highlightedEdge.from === group.from && highlightedEdge.to === group.to;

    return {
      id: `edge-${key}`,
      source: group.from,
      target: group.to,
      type: 'automataEdge',
      data: {
        label: group.symbols.join(', '),
        isHighlighted: isHL,
        curvature: hasReverse ? 0.4 : 0,
        from: group.from,
        to: group.to
      },
    };
  });
}

/**
 * Build a transition table from the automaton.
 */
export function buildTransitionTable(automaton) {
  const { states, alphabet, transitions } = automaton;

  if (!states || !alphabet || states.length === 0) return { headers: [], rows: [] };

  const headers = ['State', ...alphabet];
  const rows = states.map((state) => {
    const row = { state, isStart: state === automaton.startState, isFinal: automaton.finalStates.includes(state) };
    for (const symbol of alphabet) {
      const targets = transitions
        .filter((t) => t.from === state && t.symbol === symbol)
        .map((t) => t.to);
      row[symbol] = targets.length > 0 ? targets.join(', ') : '—';
    }
    return row;
  });

  return { headers, rows };
}
