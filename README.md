# Recurrence Lab 🚀

**Recurrence Lab** is a high-end educational workspace dedicated to mastering **Dynamic Programming (DP)** through visual intuition. Unlike standard competitive programming tools, Recurrence Lab prioritizes the **"State-First"** pedagogical framework—guiding learners to derive recurrence formulas naturally from visual inputs and decision branching.

---

## 🧠 Dynamic Programming: The Pedagogical Flow


Recurrence Lab enforces a strict, instructor-led flow to demystify DP:

1.  **Visualize the State**: Instead of starting with `f(i, j)`, we start by highlighting indices in the actual input (e.g., indices in a string or days in a stock chart).
2.  **Explore Choices**: Every recursive call is framed as a **Decision**. "Do I match these characters?" or "Do I buy this stock today?"
3.  **Derive the Recurrence**: Only after understanding the physical meaning of the state and the impact of choices do we formally define the recurrence relation.

---

## 🏗️ Data Structures in DP

The platform leverages specific data structures to visualize the core principles of Dynamic Programming:

### 1. **Recursion Trees (State Space Exploration)**
To visualize **Recursive Branching**, we model the execution as a dynamic tree.
- **Structure**: Every unique recursive call is a node. Edges represent the depth-first discovery of subproblems.
- **Optimal Substructure**: The tree visually demonstrates how a parent subproblem waits for its children to return values, combining them to form an optimal solution.

### 2. **Hash Maps (Top-Down Memoization)**
To visualize **Overlapping Subproblems**, we implement a global memoization layer using **Hash Maps**.
- **Role**: Maps serialized state keys (e.g., `i:1, j:2`) to their calculated results.
- **Visual Pruning**: When a subproblem is revisited, the engine marks it as a **"Memo Hit"** and prevents further expansion. This provides a concrete visual proof of how DP reduces exponential complexity to polynomial time.

### 3. **Matrices / 2D Arrays (Bottom-Up Tabulation)**
To bridge the gap between recursion and iteration, we use **Matrices**.
- **State Table**: A 2D grid representing the entire subproblem space.
- **Dependency Tracking**: Cells highlight which previous results (left, top, or diagonal) they depend on, mirroring the logic seen in the recursion tree.

### 4. **Linear Event Logs (Synchronized Execution)**
All visualizers are driven by a single **Linear Array of Step Events**. This ensures that the Tree, the Tabulation table, and the Instructor Walkthrough remain perfectly synchronized during playback.

---

## 🎨 Premium Features

- **Draggable Glassmorphism HUDs**: High-end, translucent panels that provide live context (Intuition, State, Logic) without obscuring the visualization.
- **Infinite Navigation**: A high-performance canvas with **Infinite Pan** and **Dynamic Zoom** to explore large, complex recursion structures.
- **Minimalist Academic UX**: A sidebar-less, full-screen workspace that focuses entirely on the derivation of logic.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS + Tailwind
- **Logic**: TypeScript

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the lab
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to begin your DP journey.

---

## 👥 Contributors

- **Balaji Chedurupalli** - AP24110011667
- **K Rushikesh** - AP24110011493
- **Soma Saish** - AP24110011658

