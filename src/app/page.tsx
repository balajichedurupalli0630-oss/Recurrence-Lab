import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-rose-500 text-transparent bg-clip-text drop-shadow-sm">
          Recurrence Lab
        </h1>
        <p className="text-xl text-neutral-300">
          An interactive educational platform to master Dynamic Programming. 
          Visualize recursion trees, overlapping subproblems, memoization, and tabulation step by step.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link href="/learn/fibonacci" className="group">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-orange-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] text-left h-full">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors">Fibonacci Sequence</h2>
              <p className="text-neutral-400">
                Start here. See how a simple recursion branches out, recomputes the same states, and how memoization optimizes it into linear time.
              </p>
            </div>
          </Link>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl opacity-50 cursor-not-allowed text-left h-full">
            <h2 className="text-2xl font-bold mb-2 text-neutral-500">Climbing Stairs (Coming Soon)</h2>
            <p className="text-neutral-500">
              Visualize how choices at each step build up to the target.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
