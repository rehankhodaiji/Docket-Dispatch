import { useState } from 'react';
import { analyticsEnabled, getChoice, saveChoice, applyConsent } from '../analytics';

/** Asks once whether visitors accept analytics. Shows nothing until a Clarity project ID is set. */
export function ConsentBanner() {
  const [choice, setChoice] = useState(getChoice());
  if (!analyticsEnabled || choice) return null;

  const pick = (c: 'granted' | 'denied') => {
    saveChoice(c);
    applyConsent(c);
    setChoice(c);
  };

  return (
    <div
      role="dialog"
      aria-label="Analytics choice"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#1A1714] bg-[#FAF8F3] px-4 sm:px-8 py-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-[#4A443B] font-sans leading-relaxed max-w-3xl">
          We use Microsoft Clarity to count visitors and see how this page is used. If you accept, it sets cookies and may
          record where you scroll and click. Anything you type into the signup form is masked.{' '}
          <a href="/privacy/" className="underline text-[#0D4952]">Privacy</a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => pick('denied')}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#1A1714] bg-white border border-[#1A1714] hover:bg-[#F3EFE6] cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={() => pick('granted')}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold text-white bg-[#0D4952] hover:bg-[#073339] cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
