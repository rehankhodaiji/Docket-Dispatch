export function Footer() {
  return (
    <footer className="w-full border-t-2 border-[#1A1714] bg-[#1A1714] text-[#FAF8F3] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Grid: Wordmark & Editorial Colophon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#36312B]">
          
          <div className="md:col-span-6 space-y-4">
            <span className="text-3xl font-serif font-bold text-white tracking-tight block">
              Docket
            </span>
            <p className="text-xs sm:text-sm text-[#BFB7A8] font-sans leading-relaxed max-w-md">
              A monthly digest of open grants, fellowships, and commissioning calls for independent non-fiction filmmakers in the United States.
            </p>
            <div className="text-xs font-mono text-[#E8A54E]">
              Published once a month.
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <span className="text-white uppercase font-semibold block tracking-wider mb-2">
              Publication Index
            </span>
            <ul className="space-y-1.5 text-[#BFB7A8]">
              <li>
                <a href="#sample-digest" className="hover:text-white transition-colors">
                  Sample Monthly Digest
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works & Sources
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-white transition-colors">
                  Curator & Credentials
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Plans & Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Inquiries & FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <span className="text-white uppercase font-semibold block tracking-wider mb-2">
              Direct Contact & Tips
            </span>
            <p className="text-[#BFB7A8] text-xs font-sans">
              Have an open grant call, fellowship, or commissioning window to submit for inclusion?
            </p>
            <div className="pt-2">
              <a
                href="mailto:rehan.khodaiji@gmail.com"
                className="text-[#E8A54E] hover:underline font-semibold block break-all"
              >
                rehan.khodaiji@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Quiet Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] font-mono text-[#8C8476]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Docket Dispatch. All rights reserved.</span>
            <a href="/privacy/" className="hover:text-white underline underline-offset-2">Privacy</a>
            <a href="/terms/" className="hover:text-white underline underline-offset-2">Terms</a>
            <a href="/refunds/" className="hover:text-white underline underline-offset-2">Cancellation and refunds</a>
          </div>
          <div className="text-[#736B5E] max-w-xl text-left sm:text-right">
            Independent publication. Funder names, broadcaster trademarks, and program logos are the property of their respective entities and are referenced strictly for editorial identification and descriptive reporting purposes.
          </div>
        </div>

      </div>
    </footer>
  );
}
