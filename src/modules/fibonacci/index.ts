import { ProblemDefinition, StepEvent } from "../../engine/types";

export const fibonacciProblem: ProblemDefinition = {
  id: "fibonacci",
  title: "Fibonacci Sequence",
  description: "Calculate the nth Fibonacci number.",
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
    `F(${state.n}) = F(${state.n - 1}) + F(${state.n - 2})`,
  generateSteps: (input: any) => {
    const steps: StepEvent[] = [];
    let stepCount = 0;
    const n = parseInt(input.n, 10);
    const memo = new Map<number, number>();

    const fib = (currentN: number, parentId?: string, depth: number = 0): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `F(${currentN})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { n: currentN },
        parentId,
        depth,
        explanation: `Evaluating ${stateKey}`,
      });

      if (memo.has(currentN)) {
        const val = memo.get(currentN)!;
        steps.push({
          id: `memo-${stepCount++}`,
          type: "memo-hit",
          stateKey,
          params: { n: currentN },
          parentId: callId,
          value: val,
          depth,
          explanation: `Cache hit for ${stateKey}, returning ${val}`,
        });
        return val;
      }

      let result: number;
      if (currentN <= 1) {
        result = currentN;
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { n: currentN },
          parentId: callId,
          value: result,
          depth,
          explanation: `Base case reached: ${stateKey} = ${result}`,
        });
      } else {
        const left = fib(currentN - 1, callId, depth + 1);
        const right = fib(currentN - 2, callId, depth + 1);
        result = left + right;

        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { n: currentN },
          parentId: callId,
          value: result,
          depth,
          explanation: `Combining results: ${stateKey} = ${left} + ${right} = ${result}`,
          formula: `F(${currentN}) = F(${currentN - 1}) + F(${currentN - 2}) = ${left} + ${right} = ${result}`,
        });
      }

      memo.set(currentN, result);
      return result;
    };

    fib(n, undefined, 0);
    return steps;
  },
};
