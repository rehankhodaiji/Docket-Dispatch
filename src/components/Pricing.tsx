interface PricingProps {
  onSelectPlan: () => void;
  totalSubmissionsCount: number;
}

export function Pricing({ onSelectPlan, totalSubmissionsCount }: PricingProps) {
  const claimedCount = Math.min(100, 68 + totalSubmissionsCount);
  const remainingCount = Math.max(0, 100 - claimedCount);

  return (
    <section id="pricing" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#F8F5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-2">
            <span className="text-[#C86A14] font-semibold">MEMBERSHIP RATES</span>
            <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
            <span>EARLY ACCESS ALLOCATION</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1714] tracking-tight mb-4">
            Transparent, Independent Pricing
          </h2>
          <p className="text-base sm:text-lg text-[#5D564C] leading-relaxed font-sans">
            Docket is 100% reader-supported. We take zero referral commissions or kickbacks from grantors, ensuring completely objective and independent reporting.
          </p>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Standard Public Launch Rate */}
          <div className="lg:col-span-5 border border-[#CEC3B0] bg-white p-6 sm:p-8 sharp-card flex flex-col justify-between">
            <div>
              <div className="border-b border-[#E8E2D5] pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#736B5E] block mb-1">
                  Public Launch Tier
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1A1714]">
                  Standard Monthly
                </h3>
                <p className="text-xs text-[#5D564C] mt-1 font-sans">
                  Available once waitlist closes and public enrollment begins.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif font-bold text-[#1A1714] tabular-nums">$15</span>
                  <span className="text-sm font-mono text-[#736B5E]">/ month</span>
                </div>
                <span className="text-xs font-mono text-[#8C8476] mt-1 block">
                  Billed monthly ($180/year total)
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm font-sans text-[#4A443B] border-t border-[#E8E2D5] pt-5">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#736B5E] font-mono">✓</span>
                  <span>Monthly digest delivered once a month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#736B5E] font-mono">✓</span>
                  <span>Direct links to official application pages & guidelines</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#736B5E] font-mono">✓</span>
                  <span>Categorized by stage (Development, Production, Post, Commissioning)</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#8C8476]">
                  <span className="text-[#8C8476] font-mono">✕</span>
                  <span>Standard renewal rate subject to future price adjustments</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#8C8476]">
                  <span className="text-[#8C8476] font-mono">✕</span>
                  <span>No custom funder research requests</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled
                className="w-full py-3 text-xs font-mono uppercase tracking-wider text-[#8C8476] bg-[#FAF8F3] border border-[#D5CDC0] sharp-card cursor-not-allowed"
              >
                Available at Public Launch
              </button>
            </div>
          </div>

          {/* Card 2: Founding Member Early Access (Prominent High-Intent Card) */}
          <div className="lg:col-span-7 border-2 border-[#1A1714] bg-[#FAF8F3] p-6 sm:p-9 sharp-card shadow-[5px_5px_0px_#1A1714] flex flex-col justify-between relative">
            
            {/* Top Corner Trade Marker (Zero-Pill: Clean unboxed text) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#1A1714] pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C86A14] block">
                  ★ EARLY-ACCESS ALLOCATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1714]">
                  Founding Member
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#0D4952] block">
                  {claimedCount}/100 CLAIMED
                </span>
                <span className="text-[11px] font-mono text-[#736B5E]">
                  {remainingCount} spots remaining
                </span>
              </div>
            </div>

            <div>
              {/* Pricing Metric Block */}
              <div className="mb-6 bg-white p-4 border border-[#E2DBCE] sharp-card">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#0D4952] tabular-nums">
                    $79
                  </span>
                  <span className="text-sm font-mono text-[#736B5E]">/ year</span>
                  <span className="text-xs font-mono font-bold text-[#C86A14] uppercase ml-auto">
                    Locked in for life (Save 56%)
                  </span>
                </div>
                <p className="text-xs font-mono text-[#5D564C] mt-2">
                  Equivalent to just <strong>$6.58/month</strong>. Your $79/year rate never increases for the lifetime of your continuous active subscription.
                </p>
              </div>

              {/* Founding Member Exclusive Inclusions */}
              <div className="space-y-3 text-xs sm:text-sm font-sans text-[#2E2822]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Rate Locked for Life:</strong> Never pay the public $180/year rate as the database grows and features expand.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Immediate Beta Delivery:</strong> Receive private early editions before the public publication launch.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Direct Funder Tracking Requests:</strong> Tell our editorial desk which niche foundations or state grants you need monitored.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Direct Calendar Feeds:</strong> Automatic 1-click sync into Google Calendar / iCal when the feature drops.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Direct Line to the Founder:</strong> Quarterly editorial office hours on documentary financing strategies.
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="pt-8 mt-6 border-t border-[#E8E2D5]">
              <button
                onClick={onSelectPlan}
                className="w-full py-3.5 px-6 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-white bg-[#0D4952] hover:bg-[#073339] transition-colors sharp-card shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Claim Founding Member Rate ($79/yr Locked for Life)</span>
                <span>→</span>
              </button>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#736B5E]">
                <span>No payment required until first dispatch</span>
                <span>Limited to the first 100 signups</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
