/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SampleDigest } from './components/SampleDigest';
import { HowItWorks } from './components/HowItWorks';
import { FounderCredibility } from './components/FounderCredibility';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { SignupSubmission, PlanId } from './types';
import { ConsentBanner } from './components/ConsentBanner';
import { loadClarity } from './analytics';

const STORAGE_KEY = 'docket_signup_submissions';

export default function App() {
  const [plan, setPlan] = useState<PlanId>('annual');
  const [submissions, setSubmissions] = useState<SignupSubmission[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [latestSubmission, setLatestSubmission] = useState<SignupSubmission | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
      }
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    loadClarity();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // ignore storage quota errors
    }
  }, [submissions]);

  const handleAddSubmission = (newSub: SignupSubmission) => {
    setSubmissions((prev) => [...prev, newSub]);
    setLatestSubmission(newSub);
  };

  const scrollToSignup = () => {
    const el = document.getElementById('signup-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // highlight effect
      el.classList.add('ring-4', 'ring-[#0D4952]/30');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#0D4952]/30');
        const input = el.querySelector('input');
        if (input) input.focus();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1A1714] flex flex-col font-sans selection:bg-[#E8A54E]/25 selection:text-[#1A1714]">
      {/* Masthead Navigation */}
      <Header onJoinClick={scrollToSignup} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 2: Hero with prominent signup form */}
        <Hero
          onAddSubmission={handleAddSubmission}
          latestSubmission={latestSubmission}
          plan={plan}
          onPlanChange={setPlan}
        />

        {/* Section 3: Sample Digest preview card with 4 illustrative listings */}
        <SampleDigest />

        {/* Section 4: How it works with 3 numbered steps */}
        <HowItWorks />

        {/* Section 5: Founder credibility (12+ years experience BBC, NatGeo, Netflix, CNN, Channel 4) */}
        <FounderCredibility />

        {/* Section 6: Pricing comparison ($15/mo monthly vs $79/yr annual) */}
        <Pricing
          onSelectPlan={(chosen) => {
            setPlan(chosen);
            scrollToSignup();
          }}
        />

        {/* Section 7: Short FAQ (3 questions) */}
        <FAQ />
      </main>

      {/* Section 8: Footer with contact email rehan.khodaiji@gmail.com */}
      <Footer />

      <ConsentBanner />
    </div>
  );
}
