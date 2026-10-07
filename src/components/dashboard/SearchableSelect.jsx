import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { fill } from '../../lib/format';
import styles from './SearchableSelect.module.css';

/**
 * Dropdown with a search box and an optional icon per option.
 *
 * The trigger is a button (so a FormField <label htmlFor> names it). Opening
 * moves focus into the search box, which drives the list with
 * aria-activedescendant: Arrow keys / Home / End move, Enter picks,
 * Escape closes and returns focus to the trigger.
 *
 * options: [{ id, label, icon? }]
 * labels:  { searchLabel, searchPlaceholder, noResults, placeholder }
 */
export default function SearchableSelect({
  id,
  value,
  options,
  onChange,
  labels,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const selected = options.find((option) => option.id === value);
  const needle = query.trim().toLowerCase();
  const filtered = needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options;
  const optionId = (index) => `${listId}-option-${index}`;

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  function openMenu() {
    setQuery('');
    setActive(Math.max(0, options.findIndex((option) => option.id === value)));
    setOpen(true);
  }

  function close(returnFocus) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function pick(option) {
    onChange(option.id);
    close(true);
  }

  function handleSearchKeyDown(event) {
    const last = filtered.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, last));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(last, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[active]) pick(filtered[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') {
      close(false);
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            openMenu();
          }
        }}
      >
        {selected ? (
          <span className={styles.value}>
            {selected.icon ? <span className={styles.triggerIcon} aria-hidden="true">{selected.icon}</span> : null}
            {selected.label}
          </span>
        ) : (
          <span className={styles.placeholder}>{labels.placeholder}</span>
        )}
        <ChevronDown size={18} aria-hidden="true" className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron} />
      </button>

      {open ? (
        <div className={styles.popover}>
          <div className={styles.searchRow}>
            <Search size={18} aria-hidden="true" className={styles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              className={styles.search}
              aria-label={labels.searchLabel}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filtered[active] ? optionId(active) : undefined}
              placeholder={labels.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <ul ref={listRef} id={listId} role="listbox" aria-label={labels.searchLabel} className={styles.list}>
            {filtered.map((option, index) => {
              const isSelected = option.id === value;
              const classes = [
                styles.option,
                isSelected ? styles.selected : '',
                index === active ? styles.active : '',
              ].filter(Boolean).join(' ');
              return (
                <li
                  key={option.id}
                  id={optionId(index)}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  className={classes}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setActive(index)}
                  onClick={() => pick(option)}
                >
                  {option.icon ? <span className={styles.icon} aria-hidden="true">{option.icon}</span> : null}
                  <span className={styles.label}>{option.label}</span>
                  {isSelected ? <Check size={18} aria-hidden="true" className={styles.check} /> : null}
                </li>
              );
            })}
          </ul>

          {filtered.length === 0 ? (
            <p className={styles.empty} role="status">{fill(labels.noResults, { q: query.trim() })}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
