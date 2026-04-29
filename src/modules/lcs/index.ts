import { ProblemDefinition, StepEvent } from "../../engine/types";

export const lcsProblem: ProblemDefinition = {
  id: "lcs",
  title: "Longest Common Subsequence (LCS)",
  description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
  precedingProblem: "Longest Common Substring",
  contextualIntro: "Remember when we looked for the longest common *substring*? That required characters to be adjacent. Today, we're looking for the *subsequence*, where characters just need to appear in the same relative order.",
  reframing: "Instead of just finding the length, let's understand how we build the subsequence by making decisions at each character pair.",
  intuition: "At each step, we compare two characters. If they match, they MUST be part of our LCS. If they don't, we explore two paths: skipping a character from string A or string B.",
  inputMeaning: "i, j = Current indices in text1 and text2 respectively.",
  outputMeaning: "The length of the longest common subsequence between text1[i...] and text2[j...].",
  inputSchema: [
    { name: "text1", label: "Text 1", type: "text", defaultValue: "abc" },
    { name: "text2", label: "Text 2", type: "text", defaultValue: "ace" }
  ],
  maxTreeInputRule: (input: any) => input.text1.length <= 4 && input.text2.length <= 4,
  buildRecurrenceText: (state: any) => "LCS(i, j) = match ? 1 + LCS(i+1, j+1) : max(LCS(i+1, j), LCS(i, j+1))",
  generateSteps: (input: any) => {
    const steps: StepEvent[] = [];
    let stepCount = 0;
    const text1 = input.text1;
    const text2 = input.text2;
    const memo = new Map<string, number>();

    const solve = (i: number, j: number, parentId?: string, depth: number = 0, branchName?: string): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `LCS(${i}, ${j})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { i, j },
        parentId,
        depth,
        branchName,
        explanation: `Comparing '${text1[i] || 'EOF'}' from Text 1 and '${text2[j] || 'EOF'}' from Text 2.`,
        choiceExplanation: branchName,
      });

      if (memo.has(`${i},${j}`)) {
        const val = memo.get(`${i},${j}`)!;
        steps.push({
          id: `memo-${stepCount++}`,
          type: "memo-hit",
          stateKey,
          params: { i, j },
          parentId: callId,
          value: val,
          depth,
          explanation: `We've already solved for these suffixes.`,
          decisionLogic: `Text 1[${i}...] and Text 2[${j}...] already calculated.`
        });
        return val;
      }

      let result: number;
      if (i >= text1.length || j >= text2.length) {
        result = 0;
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { i, j },
          parentId: callId,
          value: result,
          depth,
          explanation: "BASE CASE: End of string reached.",
          decisionLogic: "The common subsequence length is 0 when no characters remain."
        });
      } else if (text1[i] === text2[j]) {
        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { i, j },
          parentId: callId,
          depth,
          explanation: `Match: '${text1[i]}' == '${text2[j]}'!`,
          decisionLogic: "Characters match! They contribute 1 to the length. We move to the next characters in both strings."
        });
        result = 1 + solve(i + 1, j + 1, callId, depth + 1, "Match: Move Diagonally");
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { i, j },
          parentId: callId,
          value: result,
          depth,
          explanation: `LCS length for suffix starting at (${i}, ${j}) is ${result}.`,
          formula: `1 + LCS(${i+1}, ${j+1}) = 1 + ${result - 1} = ${result}`
        });
      } else {
        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { i, j },
          parentId: callId,
          depth,
          explanation: `'${text1[i]}' != '${text2[j]}'. No match here.`,
          decisionLogic: "We must explore two possibilities:\n1. Skip Text1[i] and find LCS(i+1, j)\n2. Skip Text2[j] and find LCS(i, j+1)"
        });
        const left = solve(i + 1, j, callId, depth + 1, "Skip Text1 character");
        const right = solve(i, j + 1, callId, depth + 1, "Skip Text2 character");
        result = Math.max(left, right);
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { i, j },
          parentId: callId,
          value: result,
          depth,
          explanation: `Taking the maximum of two branches.`,
          decisionLogic: `We choose the branch that gave us the longer subsequence: max(${left}, ${right}) = ${result}`,
          formula: `max(LCS(${i+1}, ${j}), LCS(${i}, ${j+1})) = max(${left}, ${right}) = ${result}`
        });
      }

      memo.set(`${i},${j}`, result);
      return result;
    };

    solve(0, 0, undefined, 0);
    return steps;
  }
};
