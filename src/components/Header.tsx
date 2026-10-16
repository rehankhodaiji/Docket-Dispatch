interface HeaderProps {
  onJoinClick: () => void;
}

export function Header({ onJoinClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-[#E2DBCE] bg-[#F8F5EE] sticky top-0 z-40 transition-colors">
      {/* Editorial Trade Dateline Strip */}
      <div className="border-b border-[#ECE5D8] px-4 sm:px-8 py-1.5 text-[11px] font-mono tracking-wider text-[#736B5E] flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-[#1A1714]">THE DOCKET DISPATCH</span>
          <span aria-hidden="true" className="text-[#C4BAA9]">/</span>
          <span>EST. 2026</span>
          <span aria-hidden="true" className="text-[#C4BAA9]">/</span>
          <span className="hidden sm:inline">FOR US DOCUMENTARY FILMMAKERS</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 tabular-nums">
          <span className="hidden md:inline">EDITION: EARLY ACCESS VOL. I</span>
          <span className="text-[#C86A14] font-medium">● 32 FOUNDING SPOTS REMAIN</span>
        </div>
      </div>

      {/* Main Masthead Navigation Bar (Top Bar Contract: 3 zones, left-aligned masthead wordmark) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display serif */}
        <div className="flex items-baseline gap-3">
          <a
            href="#"
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1A1714] hover:opacity-90 transition-opacity"
            style={{ fontFeatureSettings: '"liga" 1' }}
          >
            Docket
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links with subtle underlines */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#5D564C]">
          <a href="#sample-digest" className="hover:text-[#1A1714] transition-colors hover:underline underline-offset-4">
            Sample Digest
          </a>
          <a href="#how-it-works" className="hover:text-[#1A1714] transition-colors hover:underline underline-offset-4">
            How It Works
          </a>
          <a href="#founder" className="hover:text-[#1A1714] transition-colors hover:underline underline-offset-4">
            Founder
          </a>
          <a href="#pricing" className="hover:text-[#1A1714] transition-colors hover:underline underline-offset-4">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#1A1714] transition-colors hover:underline underline-offset-4">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onJoinClick}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#0D4952] hover:bg-[#08353C] transition-colors sharp-card shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </header>
  );
}
