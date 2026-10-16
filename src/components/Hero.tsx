import React, { useState } from 'react';
import { WaitlistSubmission } from '../types';
import fieldImg from '../assets/images/doc_editorial_field_1790590177027.jpg';

interface HeroProps {
  onAddSubmission: (submission: WaitlistSubmission) => void;
  latestSubmission: WaitlistSubmission | null;
  totalSubmissionsCount: number;
}

export function Hero({ onAddSubmission, latestSubmission, totalSubmissionsCount }: HeroProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Director');
  const [submittedThisSession, setSubmittedThisSession] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setValidationError('Please enter a valid email address to join.');
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setValidationError('Please check your email format (e.g. name@productioncompany.com).');
      return;
    }

    const newCode = `DKT-${String(totalSubmissionsCount + 69).padStart(3, '0')}`;
    const newSubmission: WaitlistSubmission = {
      email: cleanEmail,
      filmmakerRole: role,
      submittedAt: new Date().toISOString(),
      confirmationCode: newCode,
      queuePosition: totalSubmissionsCount + 69,
    };

    onAddSubmission(newSubmission);
    setSubmittedThisSession(true);
  };

  const remainingSpots = Math.max(0, 100 - (totalSubmissionsCount + 68));

  return (
    <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-[#E2DBCE] bg-[#F8F5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Editorial Front-Page Kicker */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#736B5E] mb-4">
          <span className="text-[#C86A14] font-semibold">LEAD BRIEFING</span>
          <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
          <span>SPECIAL INVESTIGATION</span>
          <span aria-hidden="true" className="text-[#CEC3B0]">/</span>
          <span>US NON-FICTION FINANCING</span>
        </div>

        {/* Main Grid: Headline & Value Proposition on Left, Visual Editorial Artifact on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          <div className="lg:col-span-7">
            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#1A1714] leading-[1.08] tracking-tight mb-6">
              Stop losing $50,000 documentary grants buried in obscure subpages and silent deadlines.
            </h1>

            {/* Subheadline with journalistic clarity */}
            <p className="text-lg sm:text-xl text-[#4A443B] font-sans leading-relaxed mb-8 max-w-2xl">
              A monthly digest of open grants, fellowships, and broadcaster commissioning calls. Monitored automatically across 70+ film institutes, broadcast desks, and funds.
            </p>

            {/* Waitlist Form Card (Sharp minimal corners, paper styling) */}
            <div id="waitlist-card" className="border-2 border-[#1A1714] bg-white p-5 sm:p-7 sharp-card shadow-[4px_4px_0px_#1A1714]">
              {submittedThisSession || latestSubmission ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0D4952]">
                    <span className="w-2.5 h-2.5 bg-[#0D4952] inline-block"></span>
                    <span>WAITLIST ENROLLMENT CONFIRMED</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1714]">
                    You’re on the priority docket.
                  </h3>
                  <p className="text-sm text-[#4A443B] leading-relaxed">
                    We reserved your spot for <span className="font-semibold text-[#1A1714]">{latestSubmission?.email || email}</span> as Founding Member #{latestSubmission?.queuePosition || (totalSubmissionsCount + 68)}. 
                    Your locked-in $79/year early-access rate is recorded.
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#736B5E] border-t border-[#E8E2D5] flex items-center justify-between">
                    <span>RECORD ID: {latestSubmission?.confirmationCode || 'DKT-069'}</span>
                    <button
                      onClick={() => {
                        setSubmittedThisSession(false);
                        setEmail('');
                      }}
                      className="text-[#C86A14] hover:underline font-semibold cursor-pointer"
                    >
                      Enroll another email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E8E2D5] pb-3">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1A1714]">
                      Join Early Access Waitlist
                    </span>
                    <span className="text-xs font-mono text-[#C86A14] font-medium">
                      {remainingSpots} of 100 Founding Member spots remaining
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-xs font-mono uppercase text-[#736B5E] mb-1">
                        Filmmaker / Production Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@documentarystudio.com"
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#CEC3B0] text-[#1A1714] placeholder:text-[#A0988A] focus:outline-none focus:border-[#0D4952] focus:bg-white sharp-card"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-xs font-mono uppercase text-[#736B5E] mb-1">
                        Primary Role
                      </label>
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#FAF8F3] border border-[#CEC3B0] text-[#1A1714] focus:outline-none focus:border-[#0D4952] focus:bg-white sharp-card"
                      >
                        <option value="Director">Director</option>
                        <option value="Producer">Producer</option>
                        <option value="Director & Producer">Director & Producer</option>
                        <option value="Cinematographer / DP">Cinematographer / DP</option>
                        <option value="Archival Researcher">Archival Researcher</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </div>
                  </div>

                  {validationError && (
                    <p className="text-xs font-mono text-[#B91C1C]">{validationError}</p>
                  )}

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-white bg-[#0D4952] hover:bg-[#073339] transition-colors sharp-card shadow-xs cursor-pointer text-center"
                    >
                      Join the Waitlist & Secure $79/yr Rate
                    </button>
                    <span className="text-[11px] font-mono text-[#736B5E]">
                      Zero spam · No card required today · Delivered monthly
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Unboxed Metadata Highlights (Zero-Pill Compliance) */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5D564C] font-mono">
              <span className="text-[#1A1714] font-medium">Delivered once a month</span>
              <span aria-hidden="true" className="text-[#CEC3B0]">·</span>
              <span>Every listing links to the official page</span>
              <span aria-hidden="true" className="text-[#CEC3B0]">·</span>
              <span>US-eligible funds only</span>
              <span aria-hidden="true" className="text-[#CEC3B0]">·</span>
              <span className="text-[#C86A14]">First 100 save 56% for life</span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Still & Broadcaster Registry Box */}
          <div className="lg:col-span-5 space-y-5">
            {/* Visual Frame */}
            <div className="border border-[#1A1714] bg-[#FAF8F3] p-2.5 sharp-card shadow-[3px_3px_0px_#CEC3B0]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE5D8] border border-[#E2DBCE]">
                <img
                  src={fieldImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/doc_editorial_field_1790590177027.jpg';
                  }}
                  alt="Documentary filmmaker operating cinema camera on location"
                  className="w-full h-full object-cover grayscale-[25%] contrast-[105%]"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                  <p className="text-[11px] font-mono tracking-wider uppercase text-[#E8A54E]">FIELD REPORT 2026</p>
                  <p className="text-xs font-serif italic text-white/95">
                    "Most independent docs do not die from lack of vision; they die from missed filing windows."
                  </p>
                </div>
              </div>
              <div className="px-1 pt-2 flex items-center justify-between text-[11px] font-mono text-[#736B5E]">
                <span>FIG. 01 — CINEMA VERITÉ PRODUCTION</span>
                <span>ARCHIVE #DKT-F26</span>
              </div>
            </div>

            {/* Trade Index Box: Sources Actively Monitored */}
            <div className="border border-[#E2DBCE] bg-[#FAF8F3] p-4 sharp-card">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#736B5E] border-b border-[#E8E2D5] pb-2 mb-3">
                <span className="font-semibold uppercase text-[#1A1714]">MONITORED FUNDERS & BROADCASTERS</span>
                <span className="text-[#0D4952]">70+ ACTIVE SOURCES</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-medium text-[#2E2822]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Sundance Institute</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>ITVS / Independent Lens</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>IDA Enterprise Fund</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>BBC Storyville</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Netflix Non-Fiction Call</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>National Geographic Doc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>CNN Films Open Submission</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Channel 4 First Cut</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
