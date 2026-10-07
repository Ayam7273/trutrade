// Data access for customer reviews. Like storeApi.js, it keeps the mock list
// in memory so replies show up across the dashboard until the page reloads.
// When the Supabase `reviews` table exists, swap these bodies for real
// queries (posting a reply should be an RLS-checked update or Edge Function).
import { useSyncExternalStore } from 'react';
import { mockReviews } from './dashboardMock';

let current = mockReviews;
const listeners = new Set();

function getSnapshot() {
  return current;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns all reviews, newest first, and re-renders when one changes.
 */
export function useReviews() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Adds the seller's public reply to a review. Resolves to { data, error }.
 */
export async function replyToReview(reviewId, body) {
  const reply = { body, postedAt: new Date().toISOString() };
  current = current.map((review) => (review.id === reviewId ? { ...review, reply } : review));
  listeners.forEach((listener) => listener());
  return { data: reply, error: null };
}
