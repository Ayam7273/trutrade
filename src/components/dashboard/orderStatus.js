// Maps each order status to its badge tone and chart colour token, so the
// table badges and the donut chart always agree.
export const ORDER_STATUS_STYLE = {
  pending: { tone: 'warning', color: 'var(--color-chart-orange)' },
  processing: { tone: 'info', color: 'var(--color-chart-blue)' },
  shipped: { tone: 'accent', color: 'var(--color-chart-purple)' },
  delivered: { tone: 'success', color: 'var(--color-chart-green)' },
  cancelled: { tone: 'error', color: 'var(--color-chart-red)' },
};
