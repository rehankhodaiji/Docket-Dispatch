import { useState } from 'react';
import { SAMPLE_LISTINGS } from '../data/sampleListings';
import { FundingListing } from '../types';

export function SampleDigest() {
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(SAMPLE_LISTINGS[0].id);

  const filteredListings = selectedStage === 'All'
    ? SAMPLE_LISTINGS
    : SAMPLE_LISTINGS.filter(item => item.stage === selectedStage);

  return (
    <section id="sample-digest" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header with Editorial Trade Framing */}
        <div className="border-b-2 border-[#1A1714] pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-2">
              <span className="text-[#0D4952] font-semibold">DIGEST PREVIEW</span>
              <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
              <span>ISSUE NO. 047</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1714] tracking-tight">
              Sample Monthly Briefing
            </h2>
          </div>

          {/* Prominent Illustrative / Sample Label */}
          <div className="bg-[#FAF2E6] border border-[#E2BA84] px-3.5 py-2 text-xs font-mono text-[#8C4806] sharp-card shrink-0">
            <span className="font-semibold uppercase tracking-wider block">Illustrative sample</span>
          </div>
        </div>

        {/* Digest Container: Styled as a physical trade gazette / dossier */}
        <div className="border-2 border-[#1A1714] bg-white sharp-card shadow-[4px_4px_0px_#1A1714]">
          
          {/* Digest Masthead Strip */}
          <div className="bg-[#1A1714] text-[#FAF8F3] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#E8A54E] tracking-wider uppercase">DOCKET / ONCE A MONTH</span>
              <span aria-hidden="true" className="text-[#555048]">|</span>
              <span className="text-[#D8D2C5]">CURATED FOR US INDEPENDENT NON-FICTION</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#BBB4A5]">
              <span>{SAMPLE_LISTINGS.length} SAMPLE LISTINGS</span>
            </div>
          </div>

          {/* Interactive Filter Strip (Allowed segmented controls) */}
          <div className="border-b border-[#E2DBCE] bg-[#FAF8F3] px-5 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              <span className="text-[#736B5E] mr-2 text-[11px] uppercase tracking-wider">Filter Stage:</span>
              {['All', ...Array.from(new Set(SAMPLE_LISTINGS.map((item) => item.stage)))].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-1 sharp-card transition-colors uppercase tracking-wider text-[11px] cursor-pointer ${
                    selectedStage === stage
                      ? 'bg-[#1A1714] text-white font-semibold'
                      : 'bg-white border border-[#D5CDC0] text-[#5D564C] hover:text-[#1A1714] hover:border-[#1A1714]'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#736B5E]">
              Click any listing to expand full editorial criteria
            </div>
          </div>

          {/* Listings List */}
          <div className="divide-y divide-[#E8E2D5]">
            {filteredListings.map((listing: FundingListing, index: number) => {
              const isExpanded = expandedId === listing.id;
              const isClosesSoon = listing.status === 'Closes Soon';

              return (
                <article
                  key={listing.id}
                  className={`p-5 sm:p-6 transition-colors ${
                    isExpanded ? 'bg-[#FCFBF8]' : 'hover:bg-[#FAF8F4]'
                  }`}
                >
                  {/* Top Bar for Listing: Funder Name, Amount Range, Status, Expand Trigger */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : listing.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-[#736B5E]">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A1714] tracking-tight hover:text-[#0D4952] transition-colors">
                          {listing.funder}
                        </h3>
                        <span aria-hidden="true" className="text-[#CEC3B0] hidden sm:inline">·</span>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#5D564C]">
                          {listing.program}
                        </span>
                      </div>

                      {/* Right metadata: Amount & Status (Zero-Pill: Clean unboxed text) */}
                      <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                        <span className="font-semibold text-[#0D4952] text-sm tabular-nums">
                          {listing.amountRange}
                        </span>
                        
                        {/* Status label: unboxed text with color cue */}
                        {isClosesSoon ? (
                          <span className="text-[#C86A14] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-[#C86A14] inline-block"></span>
                            <span>CLOSES SOON</span>
                          </span>
                        ) : (
                          <span className="text-[#0D4952] font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-[#0D4952] inline-block"></span>
                            <span>OPEN</span>
                          </span>
                        )}

                        <span className="text-[#736B5E] text-[11px] underline">
                          {isExpanded ? 'Less ↑' : 'Details ↓'}
                        </span>
                      </div>
                    </div>

                    {/* Compact Summary line */}
                    <p className="text-sm text-[#4A443B] font-sans line-clamp-2 mb-2">
                      {listing.description}
                    </p>

                    {/* Unboxed Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#736B5E]">
                      <span>STAGE: {listing.stage.toUpperCase()}</span>
                      <span aria-hidden="true" className="text-[#D8D0C2]">/</span>
                      <span className={isClosesSoon ? 'text-[#C86A14] font-medium' : 'text-[#1A1714]'}>
                        DEADLINE: {listing.deadlineDate} ({listing.deadlineRelative})
                      </span>
                      <span aria-hidden="true" className="text-[#D8D0C2]">/</span>
                      <span>DECISION: {listing.decisionTimeline}</span>
                    </div>
                  </div>

                  {/* Expanded Detail Panel with Deep Editorial Briefing */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E8E2D5] bg-[#F5F2EB] p-4 sm:p-5 sharp-card">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                        
                        <div className="md:col-span-7 space-y-3 font-sans">
                          <div>
                            <span className="font-mono uppercase font-semibold text-[#1A1714] text-[11px] block mb-1">
                              Eligibility & Creative Requirements
                            </span>
                            <p className="text-[#3A352F] leading-relaxed">
                              {listing.eligibility}
                            </p>
                          </div>

                          <div>
                            <span className="font-mono uppercase font-semibold text-[#1A1714] text-[11px] block mb-1">
                              Funder Guidelines & Submissions Note
                            </span>
                            <p className="text-[#554E44] leading-relaxed italic bg-white p-2.5 border-l-2 border-[#C86A14]">
                              "{listing.notes}"
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-5 space-y-2.5 font-mono text-[11px] border-t md:border-t-0 md:border-l border-[#E0D7C7] md:pl-5">
                          <div>
                            <span className="text-[#736B5E] block">FISCAL SPONSORSHIP</span>
                            <span className="font-semibold text-[#1A1714]">
                              {listing.fiscalSponsorRequired ? 'Required (501(c)(3) or IDA/Film Independent)' : 'Not required / Direct to LLC'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#736B5E] block">APPLICATION FEE</span>
                            <span className="font-semibold text-[#1A1714]">$0 (Per official guidelines)</span>
                          </div>

                          <div>
                            <span className="text-[#736B5E] block">INTERNAL TRACKING ID</span>
                            <span className="text-[#736B5E]">{listing.id.toUpperCase()}</span>
                          </div>

                          <div className="pt-2">
                            <span className="inline-block px-3 py-1.5 bg-[#1A1714] text-white text-[10px] uppercase tracking-wider font-semibold">
                              Direct Portal Link included in subscriber email
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </article>
              );
            })}
          </div>

          {/* Digest Bottom Banner */}
          <div className="p-4 sm:p-5 bg-[#FAF8F3] border-t border-[#E2DBCE] flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-xs font-mono">
            <a
              href="#signup-card"
              className="text-[#0D4952] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              Sign up for the full monthly edition →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
