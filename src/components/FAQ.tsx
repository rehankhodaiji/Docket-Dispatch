import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is this live yet?',
      a: 'Docket is new, and you can sign up now. Choose the Annual plan ($79/year) or the Monthly plan ($15/month, $180/year) and you will receive Docket once a month. The source list and the first issues are being put together now, alongside an initial group of independent directors and line producers. The $79/year Annual rate stays the same for as long as your subscription continues.'
    },
    {
      q: 'What if a listing is wrong?',
      a: 'Every single listing links directly to the official funder page so you can inspect the guidelines at the source. However, funding bodies occasionally modify guidelines unexpectedly, experience technical outages, or close calls early when submission volume caps are met. If you ever notice a discrepancy on a funder page, email the editor at rehan.khodaiji@gmail.com. We investigate within 24 hours and publish an immediate update.'
    },
    {
      q: 'Is this only for US filmmakers?',
      a: 'Docket’s initial launch is specifically focused on US-based independent documentary filmmakers — directors, producers, and co-production teams with US legal residency or a US 501(c)(3) fiscal sponsor. While many of the funds we track (such as Sundance Institute, IDA Enterprise, BBC Storyville, and Netflix) accept international co-productions, every single listing included in our US edition links to calls open to US creative leads. Dedicated UK and European editions will launch in subsequent phases.'
    }
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 border-b border-[#E2DBCE] bg-[#FAF8F3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="border-b-2 border-[#1A1714] pb-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-2">
            <span className="text-[#0D4952] font-semibold">CLARIFICATIONS</span>
            <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1714] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List (Sharp editorial cards) */}
        <div className="divide-y divide-[#E2DBCE] border border-[#1A1714] bg-white sharp-card shadow-[3px_3px_0px_#1A1714]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="p-5 sm:p-6 transition-colors">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-[#736B5E]">
                      0{index + 1}.
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1714] group-hover:text-[#0D4952] transition-colors">
                      {faq.q}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0D4952] shrink-0 mt-1">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] pl-7">
                    <p className="text-sm text-[#4A443B] font-sans leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick inquiry prompt */}
        <div className="mt-8 text-center sm:text-left text-xs font-mono text-[#736B5E]">
          Have a specific grant database or question not covered here? Contact the editor directly at{' '}
          <a href="mailto:rehan.khodaiji@gmail.com" className="text-[#0D4952] font-semibold underline">
            rehan.khodaiji@gmail.com
          </a>
        </div>

      </div>
    </section>
  );
}
