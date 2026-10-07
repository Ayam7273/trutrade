import { useRef, useState } from 'react';
import { CloudUpload, Plus, Upload, X } from 'lucide-react';
import { PRODUCT_IMAGE_TYPES } from '../store/imageRules';
import { productFormContent } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import styles from './ProductImagesField.module.css';

const content = productFormContent.images;

/**
 * Drop zone plus thumbnail grid. The first image is the main image; any
 * other image can be promoted. Validation happens in the parent via onAdd.
 */
export default function ProductImagesField({ images, onAdd, onRemove, onMakeMain, error, hintId, errorId }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const full = images.length >= content.max;
  const describedBy = [error ? errorId : null, hintId].filter(Boolean).join(' ');

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList ?? []);
    if (files.length) onAdd(files);
  }

  return (
    <div className={styles.field}>
      <input
        ref={inputRef}
        id="product-images"
        type="file"
        accept={PRODUCT_IMAGE_TYPES.join(',')}
        multiple
        hidden
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />

      <div className={styles.layout}>
        <div
          className={dragging ? `${styles.dropzone} ${styles.dragging}` : styles.dropzone}
          onDragOver={(event) => {
            event.preventDefault();
            if (!full) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (!full) handleFiles(event.dataTransfer.files);
          }}
        >
          <CloudUpload size={28} aria-hidden="true" className={styles.cloud} />
          <p className={styles.drop}>{content.drop}</p>
          <p className={styles.or}>{content.or}</p>
          <button
            type="button"
            className={styles.browse}
            onClick={openPicker}
            disabled={full}
            aria-describedby={describedBy || undefined}
          >
            <Upload size={16} aria-hidden="true" />
            {content.browse}
          </button>
        </div>

        <ul className={styles.grid}>
          {images.map((image, index) => {
            const n = index + 1;
            return (
              <li key={image.id} className={styles.thumb}>
                <img src={image.url} alt={fill(content.imageAlt, { n })} />
                <span className={styles.number} aria-hidden="true">{n}</span>
                {index === 0 ? (
                  <span className={styles.mainTag}>{content.main}</span>
                ) : (
                  <button
                    type="button"
                    className={styles.makeMain}
                    onClick={() => onMakeMain(image.id)}
                    aria-label={fill(content.makeMainAria, { n })}
                  >
                    {content.main}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => onRemove(image.id)}
                  aria-label={fill(content.removeAria, { n })}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
          {!full ? (
            <li>
              <button type="button" className={styles.addTile} onClick={openPicker}>
                <span className={styles.addIcon} aria-hidden="true"><Plus size={16} /></span>
                {content.addImage}
              </button>
            </li>
          ) : null}
        </ul>
      </div>

      <p id={hintId} className={styles.tip}>
        {content.tip}
        {full ? ` ${fill(content.limit, { max: content.max })}` : ''}
      </p>
      {error ? <p id={errorId} className={styles.error} role="alert">{error}</p> : null}
    </div>
  );
}
