import { WalletConnector } from "../components/wallet-connector";
import { CampaignCard } from "../components/campaign-card";
import { DonateButton } from "../components/donate-button";

const mockCampaigns = [
  {
    id: 0,
    title: "Open-source ZK Education",
    description: "Fund a series of interactive zero-knowledge proofs workshops for developers.",
    creator: "0x1234567890abcdef1234567890abcdef12345678",
    goalEth: 10,
    raisedEth: 3.5
  },
  {
    id: 1,
    title: "Ethereum Public Goods Fund",
    description: "Support core Ethereum infrastructure and client teams.",
    creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    goalEth: 25,
    raisedEth: 17.2
  }
];

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-20 top-40 h-64 w-64 rounded-full bg-accentSecondary/30 blur-3xl" />
      </div>

      <header className="flex items-center justify-between">
        <div className="text-sm font-semibold tracking-[0.2em] text-slate-400">
          BEFUND
        </div>
        <WalletConnector />
      </header>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div className="space-y-6">
          <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
            Kickstarter, rebuilt for Ethereum.
          </h1>
          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            Launch on-chain crowdfunding campaigns, accept trustless ETH donations, and learn how
            every interaction maps to real Ethereum transactions.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-accentSecondary">
              Launch a Campaign
            </button>
            <button className="rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Explore Campaigns
            </button>
          </div>
          <div className="mt-4 flex gap-6 text-xs text-slate-400">
            <div>
              <div className="text-sm font-medium text-slate-200">Fully On-Chain</div>
              <div>Campaign state and donations stored on Ethereum.</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">For Learners</div>
              <div>Inspect real transactions, events, and contract calls.</div>
            </div>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-3xl p-5">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 opacity-70" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Live Ethereum feed</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                Sepolia Testnet
              </span>
            </div>
            <div className="grid gap-3 text-xs text-slate-200">
              <div className="flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2">
                <span className="font-mono text-[11px]">createCampaign()</span>
                <span className="text-slate-400">Smart contract call</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2">
                <span className="font-mono text-[11px]">donate()</span>
                <span className="text-slate-400">Payable with ETH</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2">
                <span className="font-mono text-[11px]">withdraw()</span>
                <span className="text-slate-400">Creator only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200 md:text-base">Featured campaigns</h2>
          <span className="text-xs text-slate-400">On-chain sample data</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {mockCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              title={c.title}
              description={c.description}
              creator={c.creator}
              goalEth={c.goalEth}
              raisedEth={c.raisedEth}
              cta={<DonateButton campaignId={c.id} />}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
