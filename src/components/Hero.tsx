import React, { useState } from 'react';
import { SignupSubmission, PlanId } from '../types';
import fieldImg from '../assets/images/doc_editorial_field_1790590177027.jpg';

interface HeroProps {
  onAddSubmission: (submission: SignupSubmission) => void;
  latestSubmission: SignupSubmission | null;
  plan: PlanId;
  onPlanChange: (plan: PlanId) => void;
}

const PLAN_LABEL: Record<PlanId, string> = {
  annual: 'Annual, $79/year',
  monthly: 'Monthly, $15/month ($180/year)',
};
const PLAN_PRICE: Record<PlanId, string> = { annual: '$79/yr', monthly: '$15/mo' };

export function Hero({ onAddSubmission, latestSubmission, plan, onPlanChange }: HeroProps) {
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

    const newSubmission: SignupSubmission = {
      email: cleanEmail,
      filmmakerRole: role,
      plan,
      submittedAt: new Date().toISOString(),
    };

    onAddSubmission(newSubmission);
    setSubmittedThisSession(true);
  };

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
              A monthly digest of open grants, fellowships, and broadcaster commissioning calls. Tracked across 20+ film institutes, broadcast desks, and funds.
            </p>

            {/* Signup Form Card (Sharp minimal corners, paper styling) */}
            <div id="signup-card" className="border-2 border-[#1A1714] bg-white p-5 sm:p-7 sharp-card shadow-[4px_4px_0px_#1A1714]">
              {submittedThisSession ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0D4952]">
                    <span className="w-2.5 h-2.5 bg-[#0D4952] inline-block"></span>
                    <span>SIGNUP RECEIVED</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1714]">
                    You’re signed up.
                  </h3>
                  <p className="text-sm text-[#4A443B] leading-relaxed">
                    Thanks, <span className="font-semibold text-[#1A1714]">{latestSubmission?.email || email}</span>.
                    Plan: {PLAN_LABEL[latestSubmission?.plan || plan]}.
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#736B5E] border-t border-[#E8E2D5] flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSubmittedThisSession(false);
                        setEmail('');
                      }}
                      className="text-[#C86A14] hover:underline font-semibold cursor-pointer"
                    >
                      Sign up another email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E8E2D5] pb-3">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1A1714]">
                      Sign up for Docket
                    </span>
                    <span className="text-xs font-mono text-[#C86A14] font-medium">
                      {plan === 'annual' ? 'From $6.58/month, billed yearly' : '$15/month, billed monthly'}
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

                  <div>
                    <label htmlFor="plan" className="block text-xs font-mono uppercase text-[#736B5E] mb-1">
                      Plan
                    </label>
                    <select
                      id="plan"
                      value={plan}
                      onChange={(e) => onPlanChange(e.target.value as PlanId)}
                      className="w-full px-3 py-2.5 text-sm bg-[#FAF8F3] border border-[#CEC3B0] text-[#1A1714] focus:outline-none focus:border-[#0D4952] focus:bg-white sharp-card"
                    >
                      <option value="annual">{PLAN_LABEL.annual}</option>
                      <option value="monthly">{PLAN_LABEL.monthly}</option>
                    </select>
                  </div>

                  {validationError && (
                    <p className="text-xs font-mono text-[#B91C1C]">{validationError}</p>
                  )}

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-white bg-[#0D4952] hover:bg-[#073339] transition-colors sharp-card shadow-xs cursor-pointer text-center"
                    >
                      Sign up · {PLAN_PRICE[plan]}
                    </button>
                    <span className="text-[11px] font-mono text-[#736B5E]">
                      Zero spam · Billed {plan === 'annual' ? 'yearly' : 'monthly'} · Delivered once a month
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
              <span className="text-[#C86A14]">Annual plan saves 56%</span>
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
                <span className="font-semibold uppercase text-[#1A1714]">TRACKED FUNDERS & BROADCASTERS</span>
                <span className="text-[#0D4952]">20+ SOURCES</span>
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
                  <span>Catapult Film Fund</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Film Independent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Berkeley Film Foundation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C86A14]"></span>
                  <span>Channel 4 Documentaries</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
