'use client';

import 'react-datepicker/dist/react-datepicker.css';

import type { KeyTextField } from '@prismicio/client';
import fr from 'date-fns/locale/fr';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FaRegCalendar } from 'react-icons/fa';

import { useCartCustomFields } from '@/hooks/useSnipcart';

registerLocale('fr', fr);

type Props = {
  placeholder: KeyTextField;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(({ placeholder }, ref) => {
  const [date, setDate] = useState('');

  const { 'Date de retrait': savedDate } = useCartCustomFields(['Date de retrait']);

  useEffect(() => {
    if (savedDate) setDate(savedDate);
  }, [savedDate]);

  const now = useMemo(() => new Date(), []);
  const minDate = useMemo(() => {
    const m = new Date();
    m.setDate(m.getDate() + 1);
    if (now.getHours() >= 20) m.setDate(m.getDate() + 1);
    return m;
  }, [now]);

  const selected = date ? new Date(date) : null;

  const handleSelect = async (d: Date | null) => {
    if (!d) return;
    const iso = d.toISOString().slice(0, 10);
    setDate(iso);

    try {
      // @ts-ignore
      const state = window.Snipcart.store.getState();
      const existing: Array<{ name: string; value: string }> = state.cart.customFields || [];
      const others = existing.filter((f) => f.name !== 'Date de retrait');

      // @ts-ignore
      await window.Snipcart.api.cart.update({
        customFields: [...others, { name: 'Date de retrait', value: iso }],
      });
    } catch (err) {
      console.error('Failed to update customFields:', err);
    }
  };

  return (
    <div className="relative mx-auto inline-block w-48 xl:w-52">
      <ReactDatePicker
        calendarClassName="calendar-classname"
        dayClassName={(d) => (selected && d.toDateString() === selected.toDateString() ? 'day-classname' : '')}
        selected={selected}
        onChange={handleSelect}
        minDate={minDate}
        filterDate={(d: Date) => {
          const day = d.getDay();
          return day >= 2 && day <= 6;
        }}
        startDate={now}
        locale="fr"
        dateFormat="dd/MM/yyyy"
        customInput={
          <div className="flex cursor-pointer select-none items-center gap-2 rounded bg-[#111827] px-4 py-3 text-base text-white">
            <FaRegCalendar className="text-xl" />
            <span>
              {selected
                ? `${selected.getDate().toString().padStart(2, '0')}/${(selected.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${selected.getFullYear()}`
                : placeholder}
            </span>
          </div>
        }
        ref={ref}
        wrapperClassName="w-full"
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
