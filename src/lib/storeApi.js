// Data access for the seller's store profile. For now it keeps the mock store
// in memory, so edits show up across the dashboard until the page reloads.
// When the Supabase `stores` table exists, swap the bodies of these functions
// for real queries; components only use useStore() and saveStore().
import { useSyncExternalStore } from 'react';
import { mockStore } from './dashboardMock';

let current = { ...mockStore };
const listeners = new Set();

function getSnapshot() {
  return current;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns the current store profile and re-renders when it is saved.
 */
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Saves changed fields. Resolves to { data, error } like the Supabase client.
 */
export async function saveStore(changes) {
  current = { ...current, ...changes };
  listeners.forEach((listener) => listener());
  return { data: current, error: null };
}
