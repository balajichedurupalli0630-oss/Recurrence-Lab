import { StepEvent } from '../engine/types';

export type TreeNode = {
  id: string;
  stateKey: string;
  x: number;
  y: number;
  children: TreeNode[];
  parentId?: string;
  value?: number;
  isMemoHit?: boolean;
};

export function buildTreeLayout(steps: StepEvent[], currentStepIndex: number): TreeNode[] {
  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const calls = visibleSteps.filter(s => s.type === 'call' || s.type === 'memo-hit');
  
  const nodesMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // Build tree structure
  calls.forEach(step => {
    const node: TreeNode = {
      id: step.id,
      stateKey: step.stateKey,
      x: 0,
      y: 0,
      children: [],
      parentId: step.parentId,
      isMemoHit: step.type === 'memo-hit'
    };
    
    // check if it returned a value yet
    const returnStep = visibleSteps.find(s => s.type === 'return' && s.parentId === step.id);
    if (returnStep) {
      node.value = returnStep.value;
    } else if (step.type === 'memo-hit') {
      node.value = step.value;
    }

    nodesMap.set(step.id, node);

    if (step.parentId && nodesMap.has(step.parentId)) {
      nodesMap.get(step.parentId)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  // Assign coordinates (simple spacing)
  let currentX = 0;
  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 100;
  
  function assignCoords(node: TreeNode, depth: number): number {
    if (node.children.length === 0) {
      node.x = currentX;
      currentX += NODE_WIDTH;
    } else {
      let minX = Infinity;
      let maxX = -Infinity;
      node.children.forEach(child => {
        const childX = assignCoords(child, depth + 1);
        if (childX < minX) minX = childX;
        if (childX > maxX) maxX = childX;
      });
      node.x = (minX + maxX) / 2;
    }
    node.y = depth * NODE_HEIGHT;
    return node.x;
  }

  rootNodes.forEach(root => assignCoords(root, 0));

  return Array.from(nodesMap.values());
}
