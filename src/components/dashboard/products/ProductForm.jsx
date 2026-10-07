import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PageHeader from '../PageHeader.jsx';
import FormField from '../FormField.jsx';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Button from '../../ui/Button.jsx';
import SearchableSelect from '../SearchableSelect.jsx';
import FormSection from '../store/FormSection.jsx';
import ProductImagesField from './ProductImagesField.jsx';
import VariationsField from './VariationsField.jsx';
import { PRODUCT_IMAGE_TYPES, validateImage } from '../store/imageRules';
import { productFormContent as content } from '../../../data/dashboardContent';
import { fill, plural } from '../../../lib/format';
import { productState } from '../../../lib/products';
import { createProduct, updateProduct } from '../../../lib/productsApi';
import controls from '../FormField.module.css';
import styles from './ProductForm.module.css';

const FIELD_ORDER = ['name', 'category', 'description', 'price', 'compareAt', 'discount', 'stock'];
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;
const INVENTORY_TONE = { active: 'success', low: 'warning', out: 'error', unset: 'neutral' };

function parseMoney(text) {
  const cleaned = text.replace(/[,\s£]/g, '');
  return MONEY_PATTERN.test(cleaned) ? Number(cleaned) : null;
}

function parseWhole(text) {
  const cleaned = text.trim();
  return /^\d+$/.test(cleaned) ? Number(cleaned) : null;
}

function initialValues(product) {
  return {
    name: product?.name ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    compareAt: product?.compareAtPrice != null ? String(product.compareAtPrice) : '',
    discount: product?.discount != null ? String(product.discount) : '',
    stock: product ? String(product.stock) : '',
    visibility: product?.status === 'hidden' ? 'hidden' : 'visible',
    images: product?.images ?? (product?.imageUrl ? [{ id: 'existing', url: product.imageUrl }] : []),
    variations: product?.variations ?? [],
  };
}

function validate(values, mode) {
  const { errors: messages } = content;
  const errors = {};
  const publishing = mode === 'publish';

  if (!values.name.trim()) errors.name = messages.nameRequired;
  if (publishing && !values.category) errors.category = messages.categoryRequired;
  if (publishing && !values.description.trim()) errors.description = messages.descriptionRequired;

  const price = parseMoney(values.price);
  if (values.price.trim() === '') {
    if (publishing) errors.price = messages.priceRequired;
  } else if (price === null || price <= 0) errors.price = messages.priceInvalid;

  if (values.compareAt.trim() !== '') {
    const compareAt = parseMoney(values.compareAt);
    if (compareAt === null || (price !== null && compareAt <= price)) errors.compareAt = messages.compareAtInvalid;
  }

  if (values.discount.trim() !== '') {
    const discount = parseWhole(values.discount.replace('%', ''));
    if (discount === null || discount > 90) errors.discount = messages.discountInvalid;
  }

  if (values.stock.trim() === '') {
    if (publishing) errors.stock = messages.stockRequired;
  } else if (parseWhole(values.stock) === null) errors.stock = messages.stockInvalid;

  return errors;
}

function Affix({ prefix, suffix, children }) {
  return (
    <div className={styles.affix}>
      {prefix ? <span className={styles.prefix} aria-hidden="true">{prefix}</span> : null}
      {children}
      {suffix ? <span className={styles.suffix} aria-hidden="true">{suffix}</span> : null}
    </div>
  );
}

/**
 * Add / edit product form. `product` is undefined when adding.
 */
export default function ProductForm({ product }) {
  const navigate = useNavigate();
  const isEdit = Boolean(product);
  const isDraft = product?.status === 'draft';
  const copy = isEdit ? content.edit : content.add;
  const submitLabel = isEdit && !isDraft ? content.edit.submit : content.add.submit;

  const [values, setValues] = useState(() => initialValues(product));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(null);

  // Object URLs for picked images: revoked when removed or on leave, unless saved.
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

  function addImages(files) {
    const room = content.images.max - values.images.length;
    const accepted = [];
    let problem = null;
    files.forEach((file) => {
      const issue = validateImage(file, PRODUCT_IMAGE_TYPES);
      if (issue) problem = issue;
      else if (accepted.length < room) accepted.push(file);
    });
    const added = accepted.map((file) => {
      const url = URL.createObjectURL(file);
      blobUrls.current.add(url);
      return { id: url, url };
    });
    setValues((current) => ({ ...current, images: [...current.images, ...added] }));
    if (problem) setErrors((current) => ({ ...current, images: content.errors[problem] }));
    else clearError('images');
  }

  function removeImage(id) {
    const image = values.images.find((item) => item.id === id);
    if (image && blobUrls.current.has(image.url)) {
      URL.revokeObjectURL(image.url);
      blobUrls.current.delete(image.url);
    }
    setField('images', values.images.filter((item) => item.id !== id));
  }

  function makeMain(id) {
    const image = values.images.find((item) => item.id === id);
    setField('images', [image, ...values.images.filter((item) => item.id !== id)]);
  }

  async function save(mode) {
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setFormError(content.errors.summary);
      document.getElementById(`product-${firstInvalid}`)?.focus();
      return;
    }

    setFormError('');
    setSaving(mode);
    const fields = {
      name: values.name.trim(),
      category: values.category || content.categories[content.categories.length - 1].id,
      description: values.description.trim(),
      price: parseMoney(values.price) ?? 0,
      compareAtPrice: values.compareAt.trim() ? parseMoney(values.compareAt) : null,
      discount: values.discount.trim() ? parseWhole(values.discount.replace('%', '')) : null,
      stock: parseWhole(values.stock) ?? 0,
      status: mode === 'draft' ? 'draft' : values.visibility === 'hidden' ? 'hidden' : 'active',
      images: values.images,
      variations: values.variations,
    };

    try {
      const { error } = isEdit ? await updateProduct(product.id, fields) : await createProduct(fields);
      if (error) throw error;
      values.images.forEach((image) => keptUrls.current.add(image.url));
      navigate(content.cancelHref, { state: { saved: mode === 'draft' ? content.savedDraft : copy.saved } });
    } catch {
      setFormError(content.errors.saveFailed);
      setSaving(null);
    }
  }

  const { fields } = content;
  const pickerLabels = { ...content.categoryPicker, placeholder: fields.category.placeholder };
  // Keep an existing product's category selectable even if it is not in the list.
  const categoryOptions = values.category && !content.categories.some((option) => option.id === values.category)
    ? [...content.categories, { id: values.category, label: values.category }]
    : content.categories;
  const stock = parseWhole(values.stock);
  const inventoryState = stock === null ? 'unset' : productState({ status: 'active', stock });
  const visibility = content.publishing.options.find((option) => option.id === values.visibility);
  const [notePrefix, noteSuffix] = content.footerNote.split('{star}');

  return (
    <form
      className={styles.page}
      onSubmit={(event) => {
        event.preventDefault();
        save('publish');
      }}
      noValidate
    >
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        breadcrumbs={{
          label: content.breadcrumbLabel,
          items: [{ label: content.breadcrumbRoot, to: content.breadcrumbRootHref }, { label: copy.title }],
        }}
      />

      <div className={styles.top}>
        <div className={styles.column}>
          <FormSection title={content.basic.title} description={content.basic.body}>
            <FormField
              id="product-name"
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
                  maxLength={fields.name.maxLength}
                  value={values.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="product-category"
              label={fields.category.label}
              required
              requiredAria={content.requiredAria}
              error={errors.category}
            >
              {(props) => (
                <SearchableSelect
                  {...props}
                  value={values.category}
                  options={categoryOptions}
                  onChange={(category) => setField('category', category)}
                  labels={pickerLabels}
                />
              )}
            </FormField>

            <FormField
              id="product-description"
              label={fields.description.label}
              required
              requiredAria={content.requiredAria}
              hint={fields.description.hint}
              counter={fill(fields.description.counter, {
                n: values.description.trim().length.toLocaleString('en-GB'),
                max: fields.description.maxLength.toLocaleString('en-GB'),
              })}
              error={errors.description}
            >
              {(props) => (
                <textarea
                  {...props}
                  className={controls.textarea}
                  rows={5}
                  maxLength={fields.description.maxLength}
                  value={values.description}
                  onChange={(event) => setField('description', event.target.value)}
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title={content.images.title} description={content.images.body}>
            <ProductImagesField
              images={values.images}
              onAdd={addImages}
              onRemove={removeImage}
              onMakeMain={makeMain}
              error={errors.images}
              hintId="product-images-hint"
              errorId="product-images-error"
            />
          </FormSection>
        </div>

        <div className={styles.column}>
          <Panel title={content.categoryCard.title}>
            <div className={styles.publishing}>
              <label htmlFor="product-category-side" className={styles.publishLabel}>
                {content.categoryCard.label}
              </label>
              <SearchableSelect
                id="product-category-side"
                value={values.category}
                options={categoryOptions}
                onChange={(category) => setField('category', category)}
                labels={pickerLabels}
              />
            </div>
          </Panel>

          <Panel title={content.inventory.title}>
            <dl className={styles.summary}>
              <div className={styles.summaryRow}>
                <dt>{content.inventory.stock}</dt>
                <dd>{stock === null ? content.inventory.stockUnset : plural(content.inventory.stockValue, stock)}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>{content.inventory.status}</dt>
                <dd>
                  <StatusBadge tone={INVENTORY_TONE[inventoryState]}>
                    {content.inventory.states[inventoryState]}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title={content.publishing.title}>
            <div className={styles.publishing}>
              <label htmlFor="product-visibility" className={styles.publishLabel}>{content.publishing.label}</label>
              <div className={controls.selectWrap}>
                <select
                  id="product-visibility"
                  className={controls.select}
                  value={values.visibility}
                  aria-describedby="product-visibility-hint"
                  onChange={(event) => setField('visibility', event.target.value)}
                >
                  {content.publishing.options.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={18} className={controls.selectIcon} aria-hidden="true" />
              </div>
              <p id="product-visibility-hint" className={styles.hint}>{visibility.hint}</p>
            </div>
          </Panel>
        </div>
      </div>

      <FormSection title={content.pricing.title} description={content.pricing.body}>
        <div className={styles.pricingGrid}>
          <FormField
            id="product-price"
            label={fields.price.label}
            required
            requiredAria={content.requiredAria}
            error={errors.price}
          >
            {(props) => (
              <Affix prefix={fields.price.prefix}>
                <input
                  {...props}
                  className={`${controls.input} ${styles.withPrefix}`}
                  type="text"
                  inputMode="decimal"
                  value={values.price}
                  onChange={(event) => setField('price', event.target.value)}
                />
              </Affix>
            )}
          </FormField>

          <FormField id="product-compareAt" label={fields.compareAt.label} hint={fields.compareAt.hint} error={errors.compareAt}>
            {(props) => (
              <Affix prefix={fields.compareAt.prefix}>
                <input
                  {...props}
                  className={`${controls.input} ${styles.withPrefix}`}
                  type="text"
                  inputMode="decimal"
                  value={values.compareAt}
                  onChange={(event) => setField('compareAt', event.target.value)}
                />
              </Affix>
            )}
          </FormField>

          <FormField id="product-discount" label={fields.discount.label} error={errors.discount}>
            {(props) => (
              <Affix suffix={fields.discount.suffix}>
                <input
                  {...props}
                  className={`${controls.input} ${styles.withSuffix}`}
                  type="text"
                  inputMode="numeric"
                  value={values.discount}
                  onChange={(event) => setField('discount', event.target.value)}
                />
              </Affix>
            )}
          </FormField>

          <FormField
            id="product-stock"
            label={fields.stock.label}
            required
            requiredAria={content.requiredAria}
            error={errors.stock}
          >
            {(props) => (
              <input
                {...props}
                className={controls.input}
                type="text"
                inputMode="numeric"
                value={values.stock}
                onChange={(event) => setField('stock', event.target.value)}
              />
            )}
          </FormField>
        </div>
      </FormSection>

      <FormSection title={content.variations.title} description={content.variations.body}>
        <VariationsField variations={values.variations} onChange={(next) => setField('variations', next)} />
      </FormSection>

      <div className={styles.footer}>
        <p className={styles.note}>
          {notePrefix}
          <span className={styles.star} aria-hidden="true">*</span>
          {noteSuffix}
        </p>
        {formError ? <p className={styles.formError} role="alert">{formError}</p> : null}
        <div className={styles.buttons}>
          <Link to={content.cancelHref} className={styles.cancel}>{content.cancel}</Link>
          <Button variant="outline" onClick={() => save('draft')} disabled={Boolean(saving)}>
            {saving === 'draft' ? content.saving : content.saveDraft}
          </Button>
          <Button type="submit" disabled={Boolean(saving)}>
            {saving === 'publish' ? content.saving : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
