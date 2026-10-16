import deskImg from '../assets/images/doc_production_desk_1790590196346.jpg';

export function FounderCredibility() {
  const credentials = [
    { network: 'BBC', role: 'Production & Storyville Research' },
    { network: 'National Geographic', role: 'Field Operations & Natural History Units' },
    { network: 'Netflix', role: 'Non-Fiction Docuseries Coordination' },
    { network: 'CNN', role: 'Investigative Documentary Packaging' },
    { network: 'Channel 4', role: 'International Co-Production Tracking' },
  ];

  return (
    <section id="founder" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Editorial Profile Frame */}
        <div className="border-2 border-[#1A1714] bg-white p-6 sm:p-10 sharp-card shadow-[4px_4px_0px_#1A1714]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Column: Production Desk Still */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="border border-[#1A1714] bg-[#FAF8F3] p-2 sharp-card shadow-[2px_2px_0px_#CEC3B0]">
                <div className="aspect-[4/3] overflow-hidden bg-[#ECE5D8] border border-[#E2DBCE]">
                  <img
                    src={deskImg}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/doc_production_desk_1790590196346.jpg';
                    }}
                    alt="Documentary producer desk with treatment binder and grant notes"
                    className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-2 px-1 text-[11px] font-mono text-[#736B5E] flex justify-between">
                  <span>FIG. 02 — PRODUCTION DESK ARCHIVE</span>
                  <span>12+ YRS BROADCAST OPS</span>
                </div>
              </div>

              {/* Broadcaster Credits Bar */}
              <div className="mt-4 border-t border-[#E8E2D5] pt-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#736B5E] block mb-2">
                  Freelance Production & Operations Background:
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono font-medium text-[#1A1714]">
                  {credentials.map((cred, idx) => (
                    <div key={cred.network} className="flex items-center gap-1.5">
                      <span className="text-[#C86A14]">■</span>
                      <span>{cred.network}</span>
                      {idx < credentials.length - 1 && (
                        <span aria-hidden="true" className="text-[#CEC3B0] ml-1.5">/</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editorial Copy Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E]">
                <span className="text-[#0D4952] font-semibold">ORIGIN & OPERATIONAL RIGOR</span>
                <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
                <span>CURATOR'S NOTE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A1714] tracking-tight leading-tight">
                Built by someone who knows how high the stakes are when funding is on the line.
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-[#4A443B] font-sans leading-relaxed">
                <p>
                  Docket was created by an industry operator with <strong>12+ years of experience</strong> across creative project management, live sports broadcast operations, and freelance documentary production for networks including <strong>BBC, National Geographic, Netflix, CNN, and Channel 4</strong>.
                </p>
                <p>
                  In major broadcast operations and sports productions, mission-critical logistics are tracked with zero tolerance for oversight. But in independent documentary filmmaking, directors and producers are expected to be visionary storytellers, line producers, accountants, and private investigators all at once.
                </p>
                <p className="border-l-2 border-[#C86A14] pl-4 italic text-[#2E2822] bg-[#FAF8F4] py-2">
                  "I watched award-winning directors miss $40,000 finishing funds simply because a funder quietly adjusted a deadline on a legacy PDF subpage. Docket exists to give independent filmmakers the same intelligence and operational discipline that major network production desks rely on."
                </p>
              </div>

              {/* Byline / Signoff */}
              <div className="pt-3 border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5D564C]">
                <div>
                  <span className="font-semibold text-[#1A1714] block">Rehan Khodaiji</span>
                  <span className="text-[11px] text-[#736B5E]">Founder, Docket</span>
                </div>
                <div className="text-[11px] text-[#736B5E]">
                  Contact: <a href="mailto:rehan.khodaiji@gmail.com" className="text-[#0D4952] underline">rehan.khodaiji@gmail.com</a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
