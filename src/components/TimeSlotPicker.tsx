'use client';

import type { KeyTextField } from '@prismicio/client';
import { useEffect, useRef, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';

import { useCartCustomFields } from '@/hooks/useSnipcart';

type Props = {
  placeholder: KeyTextField;
};

export default function TimeSlotPicker({ placeholder }: Props) {
  const { 'Créneau horaire': slot } = useCartCustomFields(['Créneau horaire']);
  const [open, setOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const slots = ['10:00 à 12:00', '12:00 à 15:00', '15:00 à 19:00'];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = async (slotLabel: string) => {
    const updateCart = async () => {
      try {
        // @ts-ignore
        if (!window.Snipcart) {
          console.error("Snipcart n'est pas chargé.");
          return;
        }
        // @ts-ignore
        const state = window.Snipcart.store.getState();
        const existing: Array<{ name: string; value: string }> = state.cart.customFields || [];

        const others = existing.filter((f) => f.name !== 'Créneau horaire');

        // @ts-ignore
        await window.Snipcart.api.cart.update({
          customFields: [...others, { name: 'Créneau horaire', value: slotLabel }],
        });
      } catch (err) {
        console.error('Failed to update cart customFields:', err);
      }
    };

    // @ts-ignore
    if (window.Snipcart) {
      await updateCart();
    } else {
      document.addEventListener('snipcart.ready', () => updateCart());
    }

    setOpen(false);
  };

  return (
    <div className="relative mx-auto inline-block w-48 xl:w-52" ref={pickerRef}>
      <button
        type="button"
        className="flex w-full select-none items-center gap-2 rounded bg-[#111827] px-4 py-3 text-base text-white"
        onClick={() => setOpen((o) => !o)}
      >
        <FaRegClock className="text-xl" />
        <span>{slot || placeholder}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full">
          <div className="grid grid-cols-1 gap-2 rounded-lg bg-[#111827] p-2 shadow-lg">
            {slots.map((slotLabel) => (
              <button
                key={slotLabel}
                type="button"
                className={`w-full rounded bg-black px-4 py-2 text-sm text-white transition-opacity hover:opacity-80 ${
                  slot === slotLabel ? 'opacity-60' : ''
                }`}
                onClick={() => handleSelect(slotLabel)}
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
