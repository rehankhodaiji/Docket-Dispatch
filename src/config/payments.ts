import { PlanId } from '../types';

/**
 * Dodo Payments settings.
 * Paste the two product IDs (they start with "pdt_") from the Dodo dashboard.
 * While either is empty, the signup form does not open Dodo checkout.
 * These IDs are not secret. Never put an API key or webhook secret in this file.
 */
export const DODO_PRODUCT_IDS: Record<PlanId, string> = {
  annual: 'pdt_0NqlYEMffJzGC1wsgp3HP',
  monthly: 'pdt_0NqlYPuMF6qo1AmtTDIYl',
};

export const CHECKOUT_BASE = 'https://checkout.dodopayments.com/buy/';
export const THANKS_URL = 'https://www.docudocket.live/thanks/';

/** Builds a Dodo payment link: the reader's email is filled in and Dodo returns them to the thank-you page. */
export function buildCheckoutUrl(productId: string, email: string): string {
  const params = new URLSearchParams({ quantity: '1', email, redirect_url: THANKS_URL });
  return `${CHECKOUT_BASE}${encodeURIComponent(productId)}?${params.toString()}`;
}

/** Returns the checkout address for a plan, or null while that plan's product ID is not set. */
export function checkoutUrl(plan: PlanId, email: string): string | null {
  const id = DODO_PRODUCT_IDS[plan].trim();
  return id ? buildCheckoutUrl(id, email) : null;
}

export const PAYMENTS_CONFIGURED = Object.values(DODO_PRODUCT_IDS).every((id) => id.trim() !== '');
