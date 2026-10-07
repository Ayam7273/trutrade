import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../../ui/Button.jsx';
import { productFormContent } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import controls from '../FormField.module.css';
import utils from '../../../styles/utilities.module.css';
import styles from './VariationsField.module.css';

const content = productFormContent.variations;

function splitValues(text) {
  return [...new Set(text.split(',').map((value) => value.trim()).filter(Boolean))];
}

function AddValue({ variation, onAdd }) {
  const [text, setText] = useState('');
  const id = `variation-${variation.id}-new`;

  function submit() {
    const values = splitValues(text).filter((value) => !variation.values.includes(value));
    if (values.length) onAdd(values);
    setText('');
  }

  return (
    <span className={styles.addValue}>
      <label htmlFor={id} className={utils.srOnly}>{fill(content.addValueLabel, { name: variation.name })}</label>
      <input
        id={id}
        className={styles.addInput}
        type="text"
        placeholder={content.addValuePlaceholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit();
          }
        }}
      />
      <button type="button" className={styles.addButton} onClick={submit}>{content.addValue}</button>
    </span>
  );
}

function NewVariation({ existingNames, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [values, setValues] = useState('');
  const [errors, setErrors] = useState({});

  function save() {
    const trimmed = name.trim();
    const parsed = splitValues(values);
    const next = {};
    if (!trimmed) next.name = content.newNameRequired;
    else if (existingNames.includes(trimmed.toLowerCase())) next.name = content.newNameTaken;
    if (!parsed.length) next.values = content.newValuesRequired;
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave(trimmed, parsed);
  }

  return (
    <div className={styles.newVariation}>
      <div className={styles.newField}>
        <label htmlFor="variation-new-name">{content.newNameLabel}</label>
        <input
          id="variation-new-name"
          className={controls.input}
          type="text"
          placeholder={content.newNamePlaceholder}
          value={name}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'variation-new-name-error' : undefined}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        {errors.name ? <p id="variation-new-name-error" className={styles.error} role="alert">{errors.name}</p> : null}
      </div>
      <div className={styles.newField}>
        <label htmlFor="variation-new-values">{content.newValuesLabel}</label>
        <input
          id="variation-new-values"
          className={controls.input}
          type="text"
          placeholder={content.newValuesPlaceholder}
          value={values}
          aria-invalid={errors.values ? 'true' : 'false'}
          aria-describedby={errors.values ? 'variation-new-values-error' : undefined}
          onChange={(event) => setValues(event.target.value)}
        />
        {errors.values ? <p id="variation-new-values-error" className={styles.error} role="alert">{errors.values}</p> : null}
      </div>
      <div className={styles.newButtons}>
        <Button size="sm" variant="outline" onClick={onCancel}>{content.newCancel}</Button>
        <Button size="sm" variant="outlineOrange" onClick={save}>{content.newSave}</Button>
      </div>
    </div>
  );
}

/**
 * Variation groups (Color, Size, ...). Each option is a chip; the orange chip
 * is the default option shown first to buyers.
 */
export default function VariationsField({ variations, onChange }) {
  const [adding, setAdding] = useState(false);

  function updateVariation(id, change) {
    onChange(variations.map((variation) => (variation.id === id ? { ...variation, ...change(variation) } : variation)));
  }

  function removeValue(variation, value) {
    const values = variation.values.filter((item) => item !== value);
    updateVariation(variation.id, () => ({
      values,
      defaultValue: variation.defaultValue === value ? values[0] ?? null : variation.defaultValue,
    }));
  }

  function addVariation(name, values) {
    onChange([...variations, { id: `${Date.now()}`, name, values, defaultValue: values[0] }]);
    setAdding(false);
  }

  return (
    <div className={styles.field}>
      {variations.length === 0 && !adding ? <p className={styles.empty}>{content.empty}</p> : null}

      {variations.map((variation) => (
        <div key={variation.id} className={styles.row} role="group" aria-labelledby={`variation-${variation.id}-name`}>
          <span id={`variation-${variation.id}-name`} className={styles.name}>{variation.name}</span>
          <ul className={styles.chips}>
            {variation.values.map((value) => {
              const isDefault = value === variation.defaultValue;
              return (
                <li key={value} className={isDefault ? `${styles.chip} ${styles.selected}` : styles.chip}>
                  <button
                    type="button"
                    className={styles.chipLabel}
                    aria-pressed={isDefault}
                    aria-label={fill(content.defaultAria, { value, name: variation.name })}
                    onClick={() => updateVariation(variation.id, () => ({ defaultValue: value }))}
                  >
                    {value}
                  </button>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    aria-label={fill(content.removeValueAria, { value, name: variation.name })}
                    onClick={() => removeValue(variation, value)}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
            <li>
              <AddValue
                variation={variation}
                onAdd={(values) => updateVariation(variation.id, (current) => ({
                  values: [...current.values, ...values],
                  defaultValue: current.defaultValue ?? values[0],
                }))}
              />
            </li>
          </ul>
          <button
            type="button"
            className={styles.removeVariation}
            onClick={() => onChange(variations.filter((item) => item.id !== variation.id))}
          >
            <span className={styles.removeIcon} aria-hidden="true"><X size={14} /></span>
            {fill(content.removeVariation, { name: variation.name })}
          </button>
        </div>
      ))}

      {adding ? (
        <NewVariation
          existingNames={variations.map((variation) => variation.name.toLowerCase())}
          onSave={addVariation}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <Button size="sm" variant="outlineOrange" icon={Plus} onClick={() => setAdding(true)} className={styles.addVariation}>
          {content.addVariation}
        </Button>
      )}
    </div>
  );
}
