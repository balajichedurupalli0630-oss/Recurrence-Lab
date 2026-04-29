import { ProblemDefinition, StepEvent } from "../../engine/types";

export const stockProblem: ProblemDefinition = {
  id: "stock-dp",
  title: "Stock Trading with K Transactions",
  description: "Find the maximum profit you can achieve by buying and selling a stock with at most K transactions.",
  intuition: "At each day, we decide whether to act (buy/sell) or wait. Our goal is to maximize the total profit while respecting the transaction limit.",
  inputMeaning: "ind: current day, buy: can we buy? (1=yes, 0=no, must sell), k: remaining transactions.",
  outputMeaning: "The maximum profit achievable from the current day onwards.",
  inputSchema: [
    { name: "prices", label: "Prices (comma separated)", type: "text", defaultValue: "3,2,6,5,0,3" },
    { name: "k", label: "Max Transactions", type: "number", defaultValue: 2 }
  ],
  maxTreeInputRule: (input: any) => {
    const p = input.prices.split(',').length;
    return p <= 5 && parseInt(input.k) <= 2;
  },
  buildRecurrenceText: (state: any) => "f(ind, buy, k) = max(act, skip)",
  generateSteps: (input: any) => {
    const steps: StepEvent[] = [];
    let stepCount = 0;
    const prices = input.prices.split(',').map((p: string) => parseInt(p.trim()));
    const kMax = parseInt(input.k);
    const memo = new Map<string, number>();

    const solve = (ind: number, buy: number, k: number, parentId?: string, depth: number = 0, branchName?: string): number => {
      const callId = `call-${stepCount++}`;
      const stateKey = `f(${ind}, ${buy}, ${k})`;

      steps.push({
        id: callId,
        type: "call",
        stateKey,
        params: { ind, buy, k },
        parentId,
        depth,
        branchName,
        explanation: ind < prices.length 
          ? `Day ${ind}: The price is ${prices[ind]}. ${buy === 1 ? "You have no stock." : "You are currently holding stock."}`
          : "End of the road. No more days to trade.",
        decisionLogic: `State Meaning:\n- ind=${ind}: We are at Day ${ind}.\n- buy=${buy}: ${buy === 1 ? "Buying is allowed." : "Holding stock, selling is allowed."}\n- k=${k}: We have ${k} transactions left.`,
      });

      if (memo.has(`${ind},${buy},${k}`)) {
        const val = memo.get(`${ind},${buy},${k}`)!;
        steps.push({
          id: `memo-${stepCount++}`,
          type: "memo-hit",
          stateKey,
          params: { ind, buy, k },
          parentId: callId,
          value: val,
          depth,
          explanation: "We've seen this exact trading state before.",
          decisionLogic: "Instead of recalculating, we use our previous optimal profit for this day and transaction count."
        });
        return val;
      }

      let result: number;
      if (ind === prices.length || k === 0) {
        result = 0;
        steps.push({
          id: `return-${stepCount++}`,
          type: "return",
          stateKey,
          params: { ind, buy, k },
          parentId: callId,
          value: result,
          depth,
          explanation: k === 0 ? "No transactions left." : "Market closed.",
          decisionLogic: "Base Case: If no more transactions are allowed or we run out of days, no further profit can be made."
        });
      } else {
        const choices = buy === 1 ? [
          { label: "Buy Today", description: "Buy the stock at current price.", nextState: `Move to Day ${ind+1} with stock.`, impact: `Profit decreases by ${prices[ind]}.` },
          { label: "Skip Today", description: "Wait for a better day to buy.", nextState: `Move to Day ${ind+1} still empty-handed.`, impact: "Profit remains unchanged." }
        ] : [
          { label: "Sell Today", description: "Sell the held stock at current price.", nextState: `Move to Day ${ind+1} without stock, k decreases to ${k-1}.`, impact: `Profit increases by ${prices[ind]}.` },
          { label: "Skip Today", description: "Wait for a higher price to sell.", nextState: `Move to Day ${ind+1} still holding stock.`, impact: "Profit remains unchanged." }
        ];

        steps.push({
          id: `choice-${stepCount++}`,
          type: "choice",
          stateKey,
          params: { ind, buy, k },
          parentId: callId,
          depth,
          explanation: `What should we do on Day ${ind}?`,
          choices,
          decisionLogic: buy === 1 
            ? "Since we don't hold any stock, we can either BUY it today or SKIP it to look for a lower price later."
            : "Since we are holding stock, we can either SELL it today to book profit or SKIP and wait for a higher price."
        });

        if (buy === 1) {
          const b = -prices[ind] + solve(ind + 1, 0, k, callId, depth + 1, "Buy");
          const s = solve(ind + 1, 1, k, callId, depth + 1, "Skip");
          result = Math.max(b, s);
          steps.push({
            id: `return-${stepCount++}`,
            type: "return",
            stateKey,
            params: { ind, buy, k },
            parentId: callId,
            value: result,
            depth,
            explanation: `Optimal decision for Day ${ind} is made.`,
            decisionLogic: `We compared:\n1. Buy: profit = ${b}\n2. Skip: profit = ${s}\nTaking the maximum gives us the optimal result: ${result}`,
            formula: `f(${ind}, 1, ${k}) = max(-prices[${ind}] + f(${ind+1}, 0, ${k}), f(${ind+1}, 1, ${k})) = ${result}`
          });
        } else {
          const sell = prices[ind] + solve(ind + 1, 1, k - 1, callId, depth + 1, "Sell");
          const skip = solve(ind + 1, 0, k, callId, depth + 1, "Skip");
          result = Math.max(sell, skip);
          steps.push({
            id: `return-${stepCount++}`,
            type: "return",
            stateKey,
            params: { ind, buy, k },
            parentId: callId,
            value: result,
            depth,
            explanation: `Optimal decision for Day ${ind} (Holding) is made.`,
            decisionLogic: `We compared:\n1. Sell: profit = ${sell}\n2. Skip: profit = ${skip}\nTaking the maximum gives us the optimal result: ${result}`,
            formula: `f(${ind}, 0, ${k}) = max(prices[${ind}] + f(${ind+1}, 1, ${k-1}), f(${ind+1}, 0, ${k})) = ${result}`
          });
        }
      }

      memo.set(`${ind},${buy},${k}`, result);
      return result;
    };

    solve(0, 1, kMax, undefined, 0);
    return steps;
  }
};
