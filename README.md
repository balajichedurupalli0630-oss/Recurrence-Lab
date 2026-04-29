# Recurrence Lab

Recurrence Lab is an interactive educational web application that helps students understand how dynamic programming recurrences are formed by visualizing recursion trees, overlapping subproblems, memoization, and table construction step by step.

## Features

- **Problem Explorer**: Navigate through classic DP problems like Fibonacci, Climbing Stairs, Coin Change, 0/1 Knapsack, and LCS.
- **Recursion Tree Visualizer**: Watch how recursive calls branch out and identify overlapping subproblems.
- **DAG View**: See identical states merged into a Directed Acyclic Graph.
- **Memoization View**: Track cache hits, misses, and stored values.
- **Tabulation View**: Understand how top-down approaches convert into bottom-up table filling.
- **Formula Explanation**: Step-by-step guidance on how the recurrence relation is derived.

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The project relies heavily on a custom execution engine running in the browser:
- `Recursion Tracer`: Generates structured step data (calls, returns).
- `DAG Builder`: Detects and merges overlapping states.
- `Memo Tracker`: Records cache behavior.
- `Explanation Builder`: Links visual state with mathematical recurrence explanations.

## Educational Method

Recurrence Lab does not just show the final DP answer. It slows down execution to human speed and bridges the gap between recursive thinking and dynamic programming formulation.

## License

MIT
