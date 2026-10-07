import { useRef } from 'react';
import styles from './Tabs.module.css';

/**
 * Underlined tab row (ARIA tabs pattern). Arrow keys, Home and End move
 * between tabs; only the selected tab is in the Tab order. `panelId` is the
 * id of the element the tabs control.
 */
export default function Tabs({ label, tabs, value, onChange, panelId, idPrefix }) {
  const listRef = useRef(null);

  function handleKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === value);
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next === null) return;

    event.preventDefault();
    onChange(tabs[next].id);
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label={label} ref={listRef} onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={selected ? `${styles.tab} ${styles.selected}` : styles.tab}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
