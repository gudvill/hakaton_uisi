import { useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function FileInputButton({ onChange, multiple = false, label = 'Выбрать фото', accept = 'image/*' }) {
  const ref = useRef(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <button type="button" className="file-input-btn" onClick={() => ref.current?.click()}>
        <PhotoIcon style={{ width: 13, height: 13 }} />
        {label}
      </button>
    </>
  );
}
