import type { ReactNode } from "react";

type CampaignCardProps = {
  title: string;
  description: string;
  creator: string;
  goalEth: number;
  raisedEth: number;
  cta?: ReactNode;
};

export function CampaignCard({
  title,
  description,
  creator,
  goalEth,
  raisedEth,
  cta
}: CampaignCardProps) {
  const progress = Math.min(raisedEth / goalEth, 1);

  return (
    <div className="glass-card flex flex-col rounded-2xl p-5 shadow-xl transition hover:shadow-glow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
          Goal {goalEth} ETH
        </span>
      </div>
      <p className="mb-4 line-clamp-3 text-sm text-slate-300">{description}</p>
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>Creator</span>
        <span className="font-mono">
          {creator.slice(0, 6)}...{creator.slice(-4)}
        </span>
      </div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Raised</span>
        <span className="font-medium">
          {raisedEth.toFixed(2)} / {goalEth.toFixed(2)} ETH
        </span>
      </div>
      <div className="mb-4 h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accentSecondary transition-[width]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-slate-400">On-chain crowdfunding</span>
        {cta}
      </div>
    </div>
  );
}
