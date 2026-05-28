import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';

const chevronSvg = (open) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12" height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6a35cc"
    strokeWidth="2"
    style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function AdminSelect({ value, onChange, options, placeholder, variant = 'filter' }) {
  const selected = options.find(o => String(o.value) === String(value)) || null;

  const isForm = variant === 'form';

  const wrapperStyle = isForm
    ? { position: 'relative', display: 'block', width: '100%' }
    : { position: 'relative', display: 'inline-block' };

  const getButtonStyle = (open) => isForm
    ? {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 10px',
        background: 'white',
        border: `1px solid ${open ? '#6a35cc' : '#d4c8ff'}`,
        borderRadius: '8px',
        fontSize: '13px',
        color: selected ? '#1a1a2e' : '#999',
        fontFamily: 'inherit',
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
        textAlign: 'left',
      }
    : {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 12px 7px 14px',
        background: '#f3f0ff',
        border: `1px solid ${open ? '#6a35cc' : '#ede8ff'}`,
        borderRadius: '50px',
        fontSize: '13px',
        color: selected ? '#444' : '#999',
        fontFamily: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
      };

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div style={wrapperStyle}>

          <ListboxButton style={getButtonStyle(open)}>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected ? selected.label : placeholder}</span>
            {chevronSvg(open)}
          </ListboxButton>

          {/* Красивое выпадающее окно */}
          <ListboxOptions
            anchor="bottom start"
            style={{ zIndex: 9999, minWidth: 'var(--button-width)' }}
            className="focus:outline-none"
          >
            <div style={{
              background: '#fff',
              border: '1px solid #ede8ff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(106, 53, 204, 0.13)',
              overflow: 'hidden',
              marginTop: '4px',
              fontFamily: 'inherit',
            }}>
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="data-[focus]:bg-[#f3f0ff]"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    color: String(value) === String(option.value) ? '#6a35cc' : '#444',
                    cursor: 'pointer',
                    fontWeight: String(value) === String(option.value) ? 600 : 400,
                  }}
                >
                  {option.label}
                  {String(value) === String(option.value) && (
                    <CheckIcon style={{ width: 13, height: 13, color: '#6a35cc', flexShrink: 0 }} />
                  )}
                </ListboxOption>
              ))}
            </div>
          </ListboxOptions>

        </div>
      )}
    </Listbox>
  );
}
