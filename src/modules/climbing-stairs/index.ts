import { ProblemDefinition, StepEvent } from "../../engine/types";

export const climbingStairsProblem: ProblemDefinition = {
  id: "climbing-stairs",
  title: "Climbing Stairs",
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.",
  intuition: "Think of this as a decision tree. At each step, you have two possible choices. Each choice leads to a new subproblem with fewer steps remaining.",
  inputMeaning: "n = The number of steps remaining to reach the top.",
  outputMeaning: "The total number of unique ways to finish the climb from the current step.",
  inputSchema: [
    {
      name: "n",
      label: "n",
      type: "number",
      defaultValue: 5,
      min: 0,
      max: 10,
    },
  ],
  maxTreeInputRule: (input: any) => input.n <= 7,
  buildRecurrenceText: (state: any) =>
    `Ways(${state.n}) = Ways(${state.n - 1}) + Ways(${state.n - 2})`,
  generateSteps: (input: any) => {
    const steps: StepEvent[] = [];
    let stepCount = 0;
    const n = parseInt(input.n, 10);
    const memo = new Map<number, number>();

    const solve = (remaining: number, parentId?: string, depth: number = 0, branchName?: string): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `Ways(${remaining})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { remaining },
        parentId,
        depth,
        branchName,
        explanation: `Calculating total ways to reach the top from ${remaining} steps remaining.`,
        choiceExplanation: branchName ? `We chose to take ${branchName === 'Take 1 Step' ? '1 step' : '2 steps'} from the previous state.` : undefined,
      });

      if (memo.has(remaining)) {
        const val = memo.get(remaining)!;
        steps.push({
          id: `memo-${stepCount++}`,
          type: "memo-hit",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: val,
          depth,
          explanation: `We've already calculated Ways(${remaining}) before.`,
          decisionLogic: "Instead of re-running the entire tree, we reuse the stored value to save time.",
        });
        return val;
      }

      let result: number;
      if (remaining === 0) {
        result = 1;
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: "BASE CASE: We reached the top exactly.",
          decisionLogic: "This path is valid, so it contributes 1 way to the total.",
        });
      } else if (remaining < 0) {
        result = 0;
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: "BASE CASE: We overshot the top.",
          decisionLogic: "This path is invalid, so it contributes 0 ways.",
        });
      } else {
        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { remaining },
          parentId: callId,
          depth,
          explanation: `Why are there children? Because from ${remaining} steps, you have 2 valid decisions.`,
          decisionLogic: "1. Take 1 step (branching to n-1)\n2. Take 2 steps (branching to n-2)",
        });

        const take1 = solve(remaining - 1, callId, depth + 1, "Take 1 Step");
        const take2 = solve(remaining - 2, callId, depth + 1, "Take 2 Steps");
        result = take1 + take2;

        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: `Ways(${remaining}) is the sum of both branching decisions.`,
          decisionLogic: "We use SUM (+) because these are distinct, independent paths to the goal.",
          formula: `Ways(${remaining}) = Ways(${remaining - 1}) + Ways(${remaining - 2}) = ${take1} + ${take2} = ${result}`,
        });
      }

      memo.set(remaining, result);
      return result;
    };

    solve(n, undefined, 0);
    return steps;
  },
};
