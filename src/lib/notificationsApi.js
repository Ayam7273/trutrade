// Data access for seller notifications. Kept in memory like storeApi.js and
// reviewsApi.js; swap the bodies for Supabase queries (and a realtime
// subscription for new notifications) once the table exists.
import { useSyncExternalStore } from 'react';
import { mockNotifications } from './dashboardMock';

let current = mockNotifications;
const listeners = new Set();

function getSnapshot() {
  return current;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next) {
  current = next;
  listeners.forEach((listener) => listener());
}

/**
 * Returns all notifications, newest first, and re-renders when they change.
 */
export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export async function markNotificationRead(id) {
  if (current.some((item) => item.id === id && !item.read)) {
    update(current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }
  return { error: null };
}

export async function markAllNotificationsRead() {
  if (current.some((item) => !item.read)) {
    update(current.map((item) => (item.read ? item : { ...item, read: true })));
  }
  return { error: null };
}
