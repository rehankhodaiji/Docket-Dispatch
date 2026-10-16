export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Automated checks watch the sources',
      subtitle: '70+ grant portals, broadcaster commissioning portals, and guild boards',
      body: 'Most documentary grants aren’t announced with fanfare. They appear quietly on institutional subpages, festival foundation newsletters, and obscure regional arts council PDFs. We continuously monitor every major funding window — from Sundance, IDA, and ITVS to Netflix, BBC Storyville, Catapult, and MacArthur — so nothing slips past unnoticed.',
      points: [
        'Broadcaster commissioning portals (BBC, Netflix, Channel 4, CNN, NatGeo)',
        'Major philanthropic & investigative funds (Ford JustFilms, IDA, ITVS, MacArthur)',
        'Emerging labs, finishing funds, and international co-production treaties'
      ]
    },
    {
      num: '02',
      title: 'Every listing links to the official page',
      subtitle: 'Automation finds the changes. Each listing shows the funder page and its own wording so you can check the deadline yourself.',
      body: 'Every single entry on Docket links directly to the official application portal, showing the funder’s stated deadlines, eligibility requirements, and application guidelines so you can check details directly at the source.',
      points: [
        'Direct links to official application portals and submission guidelines',
        'Original funder eligibility rules and criteria cited directly',
        'Noting fiscal sponsorship rules, budget caps, and rough-cut requirements'
      ]
    },
    {
      num: '03',
      title: 'One email, monthly',
      subtitle: 'Delivered once a month. Clean, scannable, actionable.',
      body: 'No constant notification noise or spam. You receive a single, beautifully organized email once a month. In 5 minutes of coffee reading, you know exactly what is open, what closes this month, how much capital is on the table, and whether your current production or pitch qualifies.',
      points: [
        'Segmented by stage: Development, Production, Post-Production, Commissioning',
        'Direct links directly to application portals and submission guidelines',
        'One-click add to Google Calendar or iCal so deadlines never sneak up on you'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#F8F5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-2">
            <span className="text-[#C86A14] font-semibold">METHODOLOGY & CURATION</span>
            <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
            <span>THREE-STEP RIGOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1714] tracking-tight mb-4">
            How Docket Works
          </h2>
          <p className="text-base sm:text-lg text-[#5D564C] leading-relaxed font-sans">
            Independent filmmakers spend an average of 4–8 hours every month clicking broken bookmarks and hunting down dead grant links. Docket eliminates that operational overhead entirely.
          </p>
        </div>

        {/* 3 Step Cards with Editorial Numbering (Sharp cards, clean borders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="border border-[#1A1714] bg-white p-6 sm:p-7 sharp-card shadow-[3px_3px_0px_#1A1714] flex flex-col justify-between"
            >
              <div>
                {/* Editorial Index Number */}
                <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0D4952]">
                    {step.num}.
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#736B5E]">
                    PHASE {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1A1714] leading-snug mb-2">
                  {step.title}
                </h3>
                
                <p className="text-xs font-mono text-[#C86A14] font-medium uppercase tracking-wide mb-4">
                  {step.subtitle}
                </p>

                <p className="text-sm text-[#4A443B] font-sans leading-relaxed mb-6">
                  {step.body}
                </p>
              </div>

              {/* Bullet points with trade hairline rules */}
              <div className="border-t border-[#E8E2D5] pt-4 mt-auto space-y-2">
                {step.points.map((pt, i) => (
                  <div key={i} className="text-xs font-sans text-[#554E44] flex items-start gap-2">
                    <span className="text-[#C86A14] font-bold text-sm leading-none">›</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Adjacency Proof Strip */}
        <div className="mt-10 border border-[#D5CDC0] bg-[#FAF8F3] p-5 sharp-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#0D4952] font-bold text-base">✦</span>
            <span className="text-[#2E2822]">
              Average grant deadline discovered <strong>38 days in advance</strong> of submission cutoff.
            </span>
          </div>
          <span className="text-[#736B5E]">Never scramble 48 hours before an unannounced portal closure.</span>
        </div>

      </div>
    </section>
  );
}
