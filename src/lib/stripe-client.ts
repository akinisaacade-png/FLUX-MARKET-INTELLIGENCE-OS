import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Client-side helper to load Stripe.js lazily.
 * Uses NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY or VITE_STRIPE_PUBLISHABLE_KEY with fallback to live key.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey =
      (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY ||
      (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined) ||
      'pk_live_Y8I4kIWBXPdQIfZ2tthPIFwV00DlqCjZva';

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};
