import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

let stripeClientInstance: Stripe | null = null;

/**
 * Lazily initializes and returns the Stripe server SDK instance.
 * Using lazy initialization prevents app startup crashes when keys are missing or unconfigured.
 */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.includes('YOUR_ACTUAL_SECRET_KEY')) {
    throw new Error('STRIPE_SECRET_KEY environment variable is missing or unconfigured.');
  }
  
  if (!stripeClientInstance) {
    stripeClientInstance = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  
  return stripeClientInstance;
}

let stripeJSPromise: Promise<StripeJS | null>;

/**
 * Client-side loader for Stripe.js.
 */
export const getStripeJS = (): Promise<StripeJS | null> => {
  if (!stripeJSPromise) {
    const pubKey =
      (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY ||
      (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined) ||
      'pk_live_Y8I4kIWBXPdQIfZ2tthPIFwV00DlqCjZva';
    stripeJSPromise = loadStripe(pubKey);
  }
  return stripeJSPromise;
};

export const stripeConfig = {
  publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_Y8I4kIWBXPdQIfZ2tthPIFwV00DlqCjZva',
  priceIds: {
    monthly: process.env.STRIPE_PRICE_ID_MONTHLY || 'price_1TSOJLBMbxh6jv0C9aEJBKRt',
    yearly: process.env.STRIPE_PRICE_ID_YEARLY || 'price_1TSOKGBMbxh6jv0CMhUwlHYX',
  },
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://ai.studio/apps/0115a890-5261-45ed-8dc3-cc55385793b8',
};

