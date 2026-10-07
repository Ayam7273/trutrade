import { useRef } from 'react';
import { ACCEPTED_IMAGE_TYPES } from './imageRules';

/**
 * Hidden file input plus whatever trigger the caller renders. `children`
 * receives an `open` function to call from the visible button.
 */
export default function ImagePicker({ id, onSelect, children }) {
  const inputRef = useRef(null);

  function handleChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onSelect(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        hidden
        onChange={handleChange}
      />
      {children(() => inputRef.current?.click())}
    </>
  );
}
