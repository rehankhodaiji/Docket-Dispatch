import { CLARITY_PROJECT_ID, CONSENT_STORAGE_KEY } from './config/analytics';

type Choice = 'granted' | 'denied';

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
const win = window as unknown as { clarity?: ClarityFn };

export const analyticsEnabled = CLARITY_PROJECT_ID.trim() !== '';

export function getChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function saveChoice(choice: Choice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // storage may be blocked; the choice then lasts only for this visit
  }
}

/** Tells Clarity what the visitor chose. There are no ads on this site, so ad storage is always denied. */
export function applyConsent(choice: Choice): void {
  win.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: choice });
}

/** Loads Clarity once. Until the visitor accepts, Clarity is told "denied" so it sets no cookies. */
export function loadClarity(): void {
  if (!analyticsEnabled || win.clarity) return;
  const stub: ClarityFn = function (...args: unknown[]) {
    (stub.q = stub.q || []).push(args);
  };
  win.clarity = stub;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(CLARITY_PROJECT_ID.trim());
  document.head.appendChild(script);
  applyConsent(getChoice() ?? 'denied');
}
