import { useEffect, useRef, useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../../ui/Button.jsx';
import { reviewsPageContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import { replyToReview } from '../../../lib/reviewsApi';
import controls from '../FormField.module.css';
import styles from './ReplyForm.module.css';

/**
 * Inline reply box under a review. Focuses itself on open; Escape or
 * Cancel closes it and returns focus to the Reply button (handled by parent).
 */
export default function ReplyForm({ review, onClose, onPosted }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const fieldId = `reply-${review.id}`;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const body = text.trim();
    if (!body) {
      setError(content.replyRequired);
      textareaRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { error: postError } = await replyToReview(review.id, body);
      if (postError) throw postError;
      onPosted();
    } catch {
      setError(content.replyFailed);
      setSubmitting(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      noValidate
    >
      <FormField
        id={fieldId}
        label={fill(content.replyField, { name: review.author })}
        hint={content.replyHint}
        counter={fill(content.replyCounter, { n: text.trim().length, max: content.replyMaxLength })}
        error={error}
      >
        {(props) => (
          <textarea
            {...props}
            ref={textareaRef}
            className={controls.textarea}
            rows={3}
            maxLength={content.replyMaxLength}
            placeholder={content.replyPlaceholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (error) setError('');
            }}
          />
        )}
      </FormField>
      <div className={styles.buttons}>
        <Button size="sm" variant="outline" onClick={onClose}>{content.cancel}</Button>
        <Button size="sm" type="submit" disabled={submitting}>
          {submitting ? content.posting : content.post}
        </Button>
      </div>
    </form>
  );
}
