import { ProblemDefinition, StepEvent } from "../../engine/types";

export const climbingStairsProblem: ProblemDefinition = {
  id: "climbing-stairs",
  title: "Climbing Stairs",
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
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

    const solve = (remaining: number, parentId?: string, depth: number = 0): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `Ways(${remaining})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { remaining },
        parentId,
        depth,
        explanation: `Calculating ways to climb ${remaining} remaining steps.`,
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
          explanation: `Already solved for ${remaining} steps. Returning cached value: ${val}`,
        });
        return val;
      }

      let result: number;
      if (remaining === 0) {
        result = 1; // Reached the top
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: `Base case: Reached the top! There is 1 way to stay here.`,
        });
      } else if (remaining < 0) {
        result = 0; // Overshot
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: `Overshot the target. 0 ways to reach the top from here.`,
        });
      } else {
        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { remaining },
          parentId: callId,
          depth,
          explanation: `From ${remaining} steps, you can either take 1 step or 2 steps.`,
        });

        const take1 = solve(remaining - 1, callId, depth + 1);
        const take2 = solve(remaining - 2, callId, depth + 1);
        result = take1 + take2;

        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { remaining },
          parentId: callId,
          value: result,
          depth,
          explanation: `Total ways for ${remaining} steps is the sum of choices: ${take1} (take 1) + ${take2} (take 2) = ${result}`,
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
