import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/16/solid';

export default function FormSelect({ value, onChange, options, placeholder }) {
  const selected = options.find(o => o.value === value) || null;

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative w-full">

          <ListboxButton
            className="w-full flex items-center justify-between px-3 py-3 rounded-full text-left text-black"
            style={{ backgroundColor: 'rgba(101, 150, 255, 0.37)' }}
          >
            <span className={selected ? 'text-black' : 'text-gray-400'}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            className="w-[var(--button-width)] rounded-2xl bg-white shadow-lg ring-1 ring-black/5 mt-1 overflow-hidden focus:outline-none"
            style={{ zIndex: 9999 }}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm text-black data-[focus]:bg-blue-50"
              >
                {option.label}
                {value === option.value && (
                  <CheckIcon className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>

        </div>
      )}
    </Listbox>
  );
}
