import React, { useEffect, useRef, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';

export type TimeSlotPickerProps = {
  value: string;
  onChange: (slot: string) => void;
  placeholder: string | null;
};

export default function TimeSlotPicker({ value, onChange, placeholder }: TimeSlotPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const slots = ['10:00 à 12:00', '12:00 à 15:00', '15:00 à 17:00'];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative inline-block size-full" ref={pickerRef}>
      <button
        type="button"
        className="align-center flex size-full select-none items-center gap-2 whitespace-nowrap rounded bg-[#111827] px-4 py-2 text-base leading-none text-white"
        onClick={() => setOpen((open) => !open)}
      >
        <FaRegClock className="size-4" />
        {value || placeholder}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2">
          <div className="grid grid-cols-1 gap-2 rounded-lg bg-[#111827] p-2 shadow-lg">
            {slots.map((slotLabel) => (
              <button
                key={slotLabel}
                type="button"
                className={`w-full rounded bg-black px-4 py-2 text-sm text-white transition-opacity hover:opacity-80 ${
                  value === slotLabel ? 'opacity-60' : ''
                }`}
                onClick={() => {
                  onChange(slotLabel);
                  setOpen(false);
                }}
              >
                {slotLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
