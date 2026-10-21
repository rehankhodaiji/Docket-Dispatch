import { PlanId } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PlanId) => void;
}

export function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#F8F5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-2">
            <span className="text-[#C86A14] font-semibold">MEMBERSHIP RATES</span>
            <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
            <span>TWO PLANS</span>
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
          
          {/* Card 1: Monthly plan */}
          <div className="lg:col-span-5 border border-[#CEC3B0] bg-white p-6 sm:p-8 sharp-card flex flex-col justify-between">
            <div>
              <div className="border-b border-[#E8E2D5] pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#736B5E] block mb-1">
                  Pay month to month
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1A1714]">
                  Monthly
                </h3>
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
                onClick={() => onSelectPlan('monthly')}
                className="w-full py-3 text-xs font-mono uppercase tracking-wider font-semibold text-[#0D4952] bg-white border border-[#0D4952] hover:bg-[#E8F2F3] transition-colors sharp-card cursor-pointer"
              >
                Sign up for Monthly ($15/mo)
              </button>
            </div>
          </div>

          {/* Card 2: Annual plan (Prominent High-Intent Card) */}
          <div className="lg:col-span-7 border-2 border-[#1A1714] bg-[#FAF8F3] p-6 sm:p-9 sharp-card shadow-[5px_5px_0px_#1A1714] flex flex-col justify-between relative">
            
            {/* Top Corner Trade Marker (Zero-Pill: Clean unboxed text) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#1A1714] pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C86A14] block">
                  ★ BEST VALUE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1714]">
                  Annual
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#0D4952] block">
                  SAVE 56%
                </span>
                <span className="text-[11px] font-mono text-[#736B5E]">
                  vs the monthly plan
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
                    Billed once a year
                  </span>
                </div>
                <p className="text-xs font-mono text-[#5D564C] mt-2">
                  Equivalent to just <strong>$6.58/month</strong>. Your $79/year rate never increases for the lifetime of your continuous active subscription.
                </p>
              </div>

              {/* Annual plan inclusions */}
              <div className="space-y-3 text-xs sm:text-sm font-sans text-[#2E2822]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Rate Locked:</strong> Never pay the monthly plan's $180/year rate as the database grows and features expand.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Everything in Monthly:</strong> The full monthly digest with direct links to official application pages.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0D4952] font-mono font-bold">✓</span>
                  <span>
                    <strong>Funder Tracking Requests:</strong> Reply to any issue with a funder, foundation or state grant you want covered, and we will tell you by email whether it will be added.
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="pt-8 mt-6 border-t border-[#E8E2D5]">
              <button
                onClick={() => onSelectPlan('annual')}
                className="w-full py-3.5 px-6 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-white bg-[#0D4952] hover:bg-[#073339] transition-colors sharp-card shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign up for Annual ($79/yr)</span>
                <span>→</span>
              </button>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#736B5E]">
                <span>Billed once a year</span>
                <span>Delivered once a month</span>
              </div>
            </div>

          </div>

        </div>

        {/* How delivery and billing work, in plain words */}
        <div className="mt-8 border border-[#E2DBCE] bg-white p-5 sm:p-6 sharp-card text-sm font-sans text-[#4A443B] leading-relaxed">
          <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#1A1714] mb-2">
            How it works
          </span>
          <ul className="space-y-1.5 list-disc pl-5">
            <li>One email arrives on the first Tuesday of each month, sent to the address you sign up with.</li>
            <li>Prices are in US dollars. Annual renews once a year and Monthly renews every month, until you cancel.</li>
            <li>Cancel any time. Your access continues to the end of the period you have paid for.</li>
            <li>No refunds, except when we have billed you in error. See <a href="/refunds/" className="underline text-[#0D4952]">cancellation and refunds</a> and the <a href="/terms/" className="underline text-[#0D4952]">terms</a>.</li>
          </ul>
        </div>

      </div>
    </section>
  );
}
