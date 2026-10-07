import styles from './DataTable.module.css';

/**
 * Generic table with the shared loading / error / empty pattern.
 *
 * columns: [{ key, header, render?(row), align?: 'start' | 'end', emphasis?: bool }]
 * status:  'loading' | 'error' | 'ready'
 * messages: { loading, error, empty } from the surface's content file
 */
export default function DataTable({ caption, columns, rows, getRowKey, status = 'ready', messages }) {
  let stateMessage = null;
  if (status === 'loading') stateMessage = messages.loading;
  else if (status === 'error') stateMessage = messages.error;
  else if (rows.length === 0) stateMessage = messages.empty;

  if (stateMessage) {
    return (
      <p
        className={status === 'error' ? `${styles.state} ${styles.stateError}` : styles.state}
        role={status === 'error' ? 'alert' : 'status'}
      >
        {stateMessage}
      </p>
    );
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.align === 'end' ? styles.end : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => {
                const classes = [
                  column.align === 'end' ? styles.end : '',
                  column.emphasis ? styles.emphasis : '',
                  column.muted ? styles.muted : '',
                ].filter(Boolean).join(' ');
                return (
                  <td key={column.key} className={classes || undefined}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
