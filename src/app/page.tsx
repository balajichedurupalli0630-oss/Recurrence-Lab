import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 md:p-16 lg:p-24 selection:bg-gray-200">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-black mb-4">
            Recurrence Lab
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            An interactive educational environment for Dynamic Programming. Formulate state definitions, visualize recursive branching, identify overlapping subproblems, and derive tabulations organically.
          </p>
        </header>

        <main className="space-y-16">
          <CategorySection title="Strings and Subsequences" problems={[
            { id: 'lcs', title: 'Longest Common Subsequence', desc: 'Find the longest sequence common to two strings.', status: 'Available' }
          ]} />

          <CategorySection title="Directed Acyclic Graphs" problems={[
            { id: 'fibonacci', title: 'Fibonacci Sequence', desc: 'Introduction to overlapping subproblems and memoization.', status: 'Available' },
            { id: 'climbing-stairs', title: 'Climbing Stairs', desc: 'Understanding branch choices and path counting.', status: 'Available' }
          ]} />

          <CategorySection title="Knapsack Variations" problems={[
            { id: 'coin-change', title: 'Coin Change', desc: 'Unbounded knapsack: min/max optimizations.', status: 'Coming Soon' },
            { id: '01-knapsack', title: '0/1 Knapsack', desc: 'Include or exclude items with capacity constraints.', status: 'Coming Soon' }
          ]} />

          <CategorySection title="Strings and Subsequences" problems={[
            { id: 'lcs', title: 'Longest Common Subsequence', desc: '2D state definitions and string matching logic.', status: 'Coming Soon' }
          ]} />

          <CategorySection title="Optimization & Finance" problems={[
            { id: 'stock-dp', title: 'Best Time to Buy and Sell Stock (K Trans)', desc: 'State-first teaching on multi-variable DP (Day, Buy, K).', status: 'Available' }
          ]} />

          <CategorySection title="Intervals" problems={[
            { id: 'matrix-chain', title: 'Matrix Chain Multiplication', desc: 'Partitioning problems and O(N^3) DP.', status: 'Coming Soon' }
          ]} />
          
          <CategorySection title="Custom Problem" problems={[
            { id: 'custom', title: 'Build Your Own Recurrence', desc: 'Define state, base cases, and transitions manually.', status: 'Coming Soon' }
          ]} />
        </main>
      </div>
    </div>
  );
}

function CategorySection({ title, problems }: { title: string, problems: any[] }) {
  return (
    <section>
      <div className="border-b border-gray-200 mb-6 pb-2">
        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((prob) => {
          const isAvailable = prob.status === 'Available';
          const cardContent = (
            <div className={`p-6 bg-white border border-gray-200 rounded-sm hover:shadow-md transition-shadow duration-200 ${!isAvailable ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-black">{prob.title}</h3>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">{prob.status}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {prob.desc}
              </p>
            </div>
          );

          if (isAvailable) {
            return (
              <Link href={`/learn/${prob.id}`} key={prob.id} className="block group">
                {cardContent}
              </Link>
            );
          }

          return <div key={prob.id}>{cardContent}</div>;
        })}
      </div>
    </section>
  );
}
