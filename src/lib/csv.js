// Quotes a value for CSV and neutralises spreadsheet formulas, so a customer
// name like "=HYPERLINK(...)" is shown as text instead of being executed.
function toCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header, rows) {
  return [header, ...rows].map((row) => row.map(toCell).join(',')).join('\r\n');
}

/**
 * Triggers a browser download of CSV text. The BOM keeps Excel from
 * mangling the £ and ₦ symbols.
 */
export function downloadCsv(filename, csv) {
  const blob = new Blob([String.fromCharCode(0xfeff), csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
