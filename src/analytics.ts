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

/** Sends a named event to Clarity (a no-op until Clarity has loaded). */
export function trackEvent(name: string): void {
  win.clarity?.('event', name);
}

/** Adds a filterable tag (for example plan=annual) to the visitor's Clarity session. */
export function tagSession(key: string, value: string): void {
  win.clarity?.('set', key, value);
}

const ATTRIBUTION_KEY = 'docket_source';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

/**
 * Remembers where the visit came from (the utm_ values in the address) for this browser tab only,
 * so the payment can be tied to its source. Stored in sessionStorage; no cookie, nothing sent anywhere here.
 */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 60);
    }
    if (Object.keys(found).length && !sessionStorage.getItem(ATTRIBUTION_KEY)) {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
    }
  } catch {
    // storage may be blocked; the payment is then recorded as "direct"
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}');
  } catch {
    return {};
  }
}
