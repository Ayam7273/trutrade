// Data access for balances and wallet transactions. Kept in memory like
// storeApi.js so withdrawals and refunds show up across the dashboard until
// the page reloads.
//
// SECURITY: moving money must never be decided in the browser. When Supabase
// is connected, requestWithdrawal() must call an Edge Function that re-checks
// the balance, the verified account and the amount on the server, inside a
// transaction. The checks below only exist so the UI behaves sensibly.
import { useSyncExternalStore } from 'react';
import { mockBalances, mockTransactions, mockWithdrawal } from './dashboardMock';
import { localIsoDate } from './format';

let state = {
  balances: mockBalances,
  transactions: mockTransactions,
  withdrawal: mockWithdrawal,
};
let nextTxn = Math.max(...mockTransactions.map((txn) => Number(txn.id.replace(/\D/g, '')))) + 1;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function addTransaction(fields) {
  const txn = {
    id: `TXN-${nextTxn}`,
    currency: state.balances.currency,
    date: localIsoDate(),
    createdAt: new Date().toISOString(),
    ...fields,
  };
  nextTxn += 1;
  return txn;
}

export function useBalances() {
  return useSyncExternalStore(subscribe, () => state.balances);
}

export function useTransactions() {
  return useSyncExternalStore(subscribe, () => state.transactions);
}

export function useWithdrawal() {
  return useSyncExternalStore(subscribe, () => state.withdrawal);
}

export const MIN_WITHDRAWAL = 1000;

/**
 * Requests a payout of `amount` to the saved bank account. Creates a pending
 * payout transaction and moves the amount out of the available balance.
 * Resolves to { data: transaction, error }.
 */
export async function requestWithdrawal({ amount, note }) {
  const { balances, withdrawal } = state;
  if (!withdrawal.account.verified) return { data: null, error: new Error('Withdrawal account is not verified') };
  if (!(amount >= MIN_WITHDRAWAL) || amount > balances.available.amount) {
    return { data: null, error: new Error('Amount is outside the allowed range') };
  }

  const txn = addTransaction({ type: 'payout', amount: -amount, status: 'pending', note: note || null });
  update({
    transactions: [txn, ...state.transactions],
    balances: {
      ...balances,
      available: { ...balances.available, amount: balances.available.amount - amount },
      pending: { ...balances.pending, amount: balances.pending.amount + amount },
    },
  });
  return { data: txn, error: null };
}

/**
 * Records the escrow refund for a cancelled order. Resolves to { data, error }.
 */
export async function recordRefund(order) {
  const txn = addTransaction({
    type: 'refund',
    orderId: order.id,
    amount: -order.amount,
    currency: order.currency,
    status: 'completed',
  });
  update({ transactions: [txn, ...state.transactions] });
  return { data: txn, error: null };
}
