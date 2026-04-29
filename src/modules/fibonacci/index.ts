import { ProblemDefinition, StepEvent } from "../../engine/types";

export const fibonacciProblem: ProblemDefinition = {
  id: "fibonacci",
  title: "Fibonacci Sequence",
  description: "Calculate the nth Fibonacci number, where each number is the sum of the two preceding ones.",
  intuition: "Fibonacci is the classic example of overlapping subproblems. Notice how the same F(n) is calculated multiple times across different branches of the tree.",
  inputMeaning: "n = The index of the Fibonacci number to calculate.",
  outputMeaning: "The value of the Fibonacci number at index n.",
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

    const fib = (currentN: number, parentId?: string, depth: number = 0, branchName?: string): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `F(${currentN})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { n: currentN },
        parentId,
        depth,
        branchName,
        explanation: `Evaluating the ${currentN}th Fibonacci number.`,
        choiceExplanation: branchName ? `Calculating the ${branchName === 'n-1' ? 'first' : 'second'} component of the sum.` : undefined,
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
          explanation: `Cache hit for F(${currentN}).`,
          decisionLogic: "We already found this result in another part of the tree. Reusing it prevents redundant branching.",
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
          explanation: `BASE CASE: F(${currentN}) is defined as ${result}.`,
          decisionLogic: "Base cases stop the recursion from growing infinitely. They are the building blocks of the final answer.",
        });
      } else {
        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { n: currentN },
          parentId: callId,
          depth,
          explanation: `To find F(${currentN}), we must break it down into two smaller subproblems.`,
          decisionLogic: `1. Calculate F(${currentN - 1})\n2. Calculate F(${currentN - 2})`,
        });

        const left = fib(currentN - 1, callId, depth + 1, "n-1");
        const right = fib(currentN - 2, callId, depth + 1, "n-2");
        result = left + right;

        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { n: currentN },
          parentId: callId,
          value: result,
          depth,
          explanation: `F(${currentN}) is the sum of its two subproblems.`,
          decisionLogic: "We use SUM (+) to combine the results because the sequence definition requires both previous values.",
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
