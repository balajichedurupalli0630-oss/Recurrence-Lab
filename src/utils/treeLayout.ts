import { StepEvent } from '../engine/types';

export type TreeNode = {
  id: string;
  stateKey: string;
  x: number;
  y: number;
  childrenIds: string[];
  parentIds: string[];
  value?: number;
  isMemoHit?: boolean;
};

export function buildTreeLayout(
  steps: StepEvent[], 
  currentStepIndex: number, 
  mode: 'tree' | 'dag' = 'tree'
): TreeNode[] {
  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const calls = visibleSteps.filter(s => s.type === 'call' || s.type === 'memo-hit');
  
  const nodesMap = new Map<string, TreeNode>();
  const idMapping = new Map<string, string>(); // Maps step.id to node.id (different in DAG mode)

  // 1. Identify unique nodes
  calls.forEach(step => {
    let nodeId = step.id;
    if (mode === 'dag') {
      // In DAG mode, the "id" of a node is its stateKey
      nodeId = step.stateKey;
    }

    if (!nodesMap.has(nodeId)) {
      nodesMap.set(nodeId, {
        id: nodeId,
        stateKey: step.stateKey,
        x: 0,
        y: 0,
        childrenIds: [],
        parentIds: [],
        isMemoHit: step.type === 'memo-hit'
      });
    }
    idMapping.set(step.id, nodeId);

    const node = nodesMap.get(nodeId)!;
    // Check for value
    const returnStep = visibleSteps.find(s => s.type === 'return' && s.parentId === step.id);
    if (returnStep) {
      node.value = returnStep.value;
    } else if (step.type === 'memo-hit') {
      node.value = step.value;
    }
  });

  // 2. Build edges
  calls.forEach(step => {
    const nodeId = idMapping.get(step.id)!;
    const node = nodesMap.get(nodeId)!;

    if (step.parentId) {
      const parentNodeId = idMapping.get(step.parentId);
      if (parentNodeId && parentNodeId !== nodeId) {
        const parentNode = nodesMap.get(parentNodeId)!;
        if (!parentNode.childrenIds.includes(nodeId)) {
          parentNode.childrenIds.push(nodeId);
        }
        if (!node.parentIds.includes(parentNodeId)) {
          node.parentIds.push(parentNodeId);
        }
      }
    }
  });

  // 3. Layout (Simple Layered Layout)
  const nodes = Array.from(nodesMap.values());
  const rootNodes = nodes.filter(n => n.parentIds.length === 0);

  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 100;
  let currentX = 0;

  const visited = new Set<string>();

  function assignCoords(nodeId: string, depth: number): number {
    const node = nodesMap.get(nodeId)!;
    if (visited.has(nodeId)) return node.x;
    visited.add(nodeId);

    if (node.childrenIds.length === 0) {
      node.x = currentX;
      currentX += NODE_WIDTH;
    } else {
      let minX = Infinity;
      let maxX = -Infinity;
      node.childrenIds.forEach(childId => {
        const childX = assignCoords(childId, depth + 1);
        if (childX < minX) minX = childX;
        if (childX > maxX) maxX = childX;
      });
      node.x = (minX + maxX) / 2;
    }
    node.y = depth * NODE_HEIGHT;
    return node.x;
  }

  rootNodes.forEach(root => assignCoords(root.id, 0));

  return nodes;
}
