import { getBezierPath, getEdgeCenter, EdgeLabelRenderer, useInternalNode } from '@xyflow/react';

/**
 * Premium Automata Edge with Floating Logic
 * Calculates intersection points with circular nodes for perfect arrow alignment.
 */
export default function AutomataEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  // Node dimensions (radius = 50)
  const radius = 50;
  const sx = sourceNode.internals.positionAbsolute.x + radius;
  const sy = sourceNode.internals.positionAbsolute.y + radius;
  const tx = targetNode.internals.positionAbsolute.x + radius;
  const ty = targetNode.internals.positionAbsolute.y + radius;

  const isSelfLoop = source === target;
  const isHighlighted = data?.isHighlighted;
  const curvature = data?.curvature || 0;

  let edgePath = '';
  let labelX, labelY;
  let angle = 0;
  let finalTargetX = tx;
  let finalTargetY = ty;

  if (isSelfLoop) {
    const loopHeight = 70;
    // Self loop path centered on top
    const p0x = sx - 25, p0y = sy - 44;
    const p1x = sx - 45, p1y = sy - loopHeight - 30;
    const p2x = sx + 45, p2y = sy - loopHeight - 30;
    const p3x = sx + 25, p3y = sy - 44;
    
    edgePath = `M ${p0x},${p0y} C ${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
    labelX = sx;
    labelY = sy - loopHeight - 15;
    
    // Tangent at t=1 is 3(P3 - P2)
    angle = Math.atan2(p3y - p2y, p3x - p2x) * (180 / Math.PI);
    finalTargetX = p3x;
    finalTargetY = p3y;
  } else {
    // Calculate vector from source to target
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Normalized direction
    const unitX = dx / dist;
    const unitY = dy / dist;

    // Start/End points at node boundaries
    const startX = sx + unitX * radius;
    const startY = sy + unitY * radius;
    const endX = tx - unitX * radius;
    const endY = ty - unitY * radius;

    if (curvature !== 0) {
      // Curved path for bidirectional
      const centerX = (startX + endX) / 2;
      const centerY = (startY + endY) / 2;
      
      // Normal vector
      const nx = -unitY;
      const ny = unitX;
      
      const offset = curvature * 60; 
      const cpX = centerX + nx * offset;
      const cpY = centerY + ny * offset;
      
      edgePath = `M ${startX},${startY} Q ${cpX},${cpY} ${endX},${endY}`;
      labelX = cpX;
      labelY = cpY;
      angle = Math.atan2(endY - cpY, endX - cpX) * (180 / Math.PI);
      finalTargetX = endX;
      finalTargetY = endY;
    } else {
      // Straight path
      edgePath = `M ${startX},${startY} L ${endX},${endY}`;
      labelX = (startX + endX) / 2;
      labelY = (startY + endY) / 2;
      angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
      finalTargetX = endX;
      finalTargetY = endY;
    }
  }

  const strokeColor = isHighlighted ? '#10b981' : '#3b82f6';
  const strokeWidth = isHighlighted ? 4 : 3;

  return (
    <>
      {isHighlighted && (
        <path
          d={edgePath}
          stroke={strokeColor}
          strokeWidth={strokeWidth + 6}
          strokeOpacity={0.2}
          fill="none"
          className="animate-pulse"
        />
      )}

      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        fill="none"
      />

      <path
        d="M -12 -6 L 0 0 L -12 6 Z"
        fill={strokeColor}
        transform={`translate(${finalTargetX},${finalTargetY}) rotate(${angle})`}
        style={{ transition: 'fill 0.3s ease' }}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <div
            style={{
              background: isHighlighted ? '#10b981' : '#0f172a',
              color: isHighlighted ? '#064e3b' : 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 900,
              border: isHighlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: isHighlighted ? '0 0 15px rgba(16, 185, 129, 0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {data?.label}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
