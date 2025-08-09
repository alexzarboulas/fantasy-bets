export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70">
          <span>🧠</span> AI sets the odds (even for absurd bets)
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Make outrageous predictions.<br className="hidden sm:block" />
          <span className="text-indigo-300">See if the odds agree.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-white/70">
          Prototype marketplace for playful, AI-priced markets. Create a market, invite friends,
          and let the model do the bookmaking.
        </p>

        <div className="flex items-center justify-center gap-3">
          <a href="/create" className="btn btn-primary">Create a Market</a>
          <a href="/markets" className="btn btn-ghost">Browse Markets</a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-1">Instant Odds</h3>
          <p className="text-white/70 text-sm">Type a prompt, get model‑priced probabilities in seconds.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-1">Social First</h3>
          <p className="text-white/70 text-sm">Share private links, challenge friends, track bragging rights.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-1">Absurd Allowed</h3>
          <p className="text-white/70 text-sm">Fun, safe, not real money. The weirder the premise, the better.</p>
        </div>
      </section>
    </div>
  );
}
