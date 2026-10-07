import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PageHeader from '../PageHeader.jsx';
import FormField from '../FormField.jsx';
import Switch from '../Switch.jsx';
import Button from '../../ui/Button.jsx';
import FormSection from './FormSection.jsx';
import BrandingFields from './BrandingFields.jsx';
import StorefrontPreviewCard from './StorefrontPreviewCard.jsx';
import StoreStatusCallout from './StoreStatusCallout.jsx';
import { validateImage } from './imageRules';
import { editStoreContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import { saveStore, useStore } from '../../../lib/storeApi';
import controls from '../FormField.module.css';
import styles from './EditStore.module.css';

const FIELD_ORDER = ['name', 'category', 'description', 'email', 'phone'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?\d{7,15}$/;

function validate(values) {
  const { errors: messages, fields } = content;
  const errors = {};
  const name = values.name.trim();
  const description = values.description.trim();
  const email = values.email.trim();
  const phone = values.phone.replace(/[\s()-]/g, '');

  if (!name) errors.name = messages.nameRequired;
  else if (name.length > fields.name.maxLength) errors.name = messages.nameTooLong;
  if (!values.category) errors.category = messages.categoryRequired;
  if (!description) errors.description = messages.descriptionRequired;
  else if (description.length > fields.description.maxLength) errors.description = messages.descriptionTooLong;
  if (!email) errors.email = messages.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = messages.emailInvalid;
  if (!phone) errors.phone = messages.phoneRequired;
  else if (!PHONE_PATTERN.test(phone)) errors.phone = messages.phoneInvalid;

  return errors;
}

export default function EditStore() {
  const store = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => ({
    name: store.name,
    category: store.category,
    description: store.description,
    email: store.email,
    phone: store.phone,
    location: store.location,
    active: store.active,
    logoUrl: store.logoUrl,
    bannerUrl: store.bannerUrl,
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Object URLs for picked images. Revoked on leave unless they were saved.
  // Once Supabase Storage is wired up, upload the files on save instead.
  const blobUrls = useRef(new Set());
  const keptUrls = useRef(new Set());

  useEffect(() => {
    const created = blobUrls.current;
    const kept = keptUrls.current;
    return () => {
      created.forEach((url) => {
        if (!kept.has(url)) URL.revokeObjectURL(url);
      });
    };
  }, []);

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    clearError(field);
  }

  function handlePick(kind, file) {
    const problem = validateImage(file);
    if (problem) {
      setErrors((current) => ({ ...current, [kind]: content.errors[problem] }));
      return;
    }
    const url = URL.createObjectURL(file);
    blobUrls.current.add(url);
    setField(`${kind}Url`, url);
    clearError(kind);
  }

  function handleRemove(kind) {
    setField(`${kind}Url`, null);
    clearError(kind);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setFormError(content.errors.summary);
      document.getElementById(`store-${firstInvalid}`)?.focus();
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      const { error } = await saveStore({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        location: values.location.trim(),
      });
      if (error) throw error;
      keptUrls.current.add(values.logoUrl);
      keptUrls.current.add(values.bannerUrl);
      navigate(content.cancelHref, { state: { saved: true } });
    } catch {
      setFormError(content.errors.saveFailed);
      setSubmitting(false);
    }
  }

  const { fields } = content;
  const descriptionLength = values.description.trim().length;

  return (
    <form className={styles.page} onSubmit={handleSubmit} noValidate>
      <PageHeader title={content.title} subtitle={content.subtitle} />

      <div className={styles.grid}>
        <div className={styles.column}>
          <FormSection title={content.info.title} description={content.info.body}>
            <FormField
              id="store-name"
              label={fields.name.label}
              required
              requiredAria={content.requiredAria}
              error={errors.name}
            >
              {(props) => (
                <input
                  {...props}
                  className={controls.input}
                  type="text"
                  autoComplete="organization"
                  maxLength={fields.name.maxLength}
                  value={values.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="store-category"
              label={fields.category.label}
              required
              requiredAria={content.requiredAria}
              error={errors.category}
            >
              {(props) => (
                <div className={controls.selectWrap}>
                  <select
                    {...props}
                    className={controls.select}
                    value={values.category}
                    onChange={(event) => setField('category', event.target.value)}
                  >
                    <option value="" disabled>{fields.category.placeholder}</option>
                    {content.categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className={controls.selectIcon} aria-hidden="true" />
                </div>
              )}
            </FormField>

            <FormField
              id="store-description"
              label={fields.description.label}
              required
              requiredAria={content.requiredAria}
              hint={fields.description.hint}
              counter={fill(fields.description.counter, {
                n: descriptionLength,
                max: fields.description.maxLength,
              })}
              error={errors.description}
            >
              {(props) => (
                <textarea
                  {...props}
                  className={controls.textarea}
                  rows={4}
                  maxLength={fields.description.maxLength}
                  value={values.description}
                  onChange={(event) => setField('description', event.target.value)}
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title={content.branding.title} description={content.branding.body}>
            <BrandingFields
              storeName={values.name}
              logoUrl={values.logoUrl}
              bannerUrl={values.bannerUrl}
              errors={errors}
              onPick={handlePick}
              onRemove={handleRemove}
            />
          </FormSection>
        </div>

        <div className={styles.column}>
          <StorefrontPreviewCard store={store} values={values} />

          <StoreStatusCallout active={values.active}>
            <Switch
              id="store-active"
              checked={values.active}
              onChange={(checked) => setField('active', checked)}
              label={content.status.toggleAria}
            />
          </StoreStatusCallout>

          <FormSection title={content.contact.title} description={content.contact.body}>
            <FormField
              id="store-email"
              label={fields.email.label}
              required
              requiredAria={content.requiredAria}
              error={errors.email}
            >
              {(props) => (
                <input
                  {...props}
                  className={controls.input}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => setField('email', event.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="store-phone"
              label={fields.phone.label}
              required
              requiredAria={content.requiredAria}
              error={errors.phone}
            >
              {(props) => (
                <input
                  {...props}
                  className={controls.input}
                  type="tel"
                  autoComplete="tel"
                  placeholder={fields.phone.placeholder}
                  value={values.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                />
              )}
            </FormField>

            <FormField id="store-location" label={fields.location.label}>
              {(props) => (
                <input
                  {...props}
                  className={controls.input}
                  type="text"
                  autoComplete="address-level2"
                  placeholder={fields.location.placeholder}
                  value={values.location}
                  onChange={(event) => setField('location', event.target.value)}
                />
              )}
            </FormField>
          </FormSection>
        </div>
      </div>

      <div className={styles.actions}>
        {formError ? (
          <p className={styles.formError} role="alert">{formError}</p>
        ) : null}
        <div className={styles.buttons}>
          <Button to={content.cancelHref} variant="outline">{content.cancel}</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? content.saving : content.save}
          </Button>
        </div>
      </div>
    </form>
  );
}
