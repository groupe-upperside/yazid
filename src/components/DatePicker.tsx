'use client';

import 'react-datepicker/dist/react-datepicker.css';

import type { GroupField, KeyTextField } from '@prismicio/client';
import { format, isAfter, isBefore, isValid, parse, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FaRegCalendar } from 'react-icons/fa';

import { useCartCustomFields } from '@/hooks/useSnipcart';

// @ts-ignore
registerLocale('fr', fr);

type Props = {
  placeholder: KeyTextField;
  excludedDates: GroupField;
  // When provided, forces the selectable window to [minDateOverride, maxDateOverride]
  minDateOverride?: Date;
  maxDateOverride?: Date;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(
  ({ placeholder, excludedDates, minDateOverride, maxDateOverride }, ref) => {
    const [date, setDate] = useState('');

    const { 'Date de retrait': savedDate } = useCartCustomFields(['Date de retrait']);

    useEffect(() => {
      if (savedDate) setDate(savedDate);
    }, [savedDate]);

    const now = useMemo(() => new Date(), []);

    // Default minimum date rule (tomorrow, +1 more day after 20:00)
    const defaultMinDate = useMemo(() => {
      const m = new Date();
      m.setDate(m.getDate() + 1);
      if (now.getHours() >= 20) m.setDate(m.getDate() + 1);
      return m;
    }, [now]);

    const computedMinDate = useMemo(() => minDateOverride ?? defaultMinDate, [minDateOverride, defaultMinDate]);
    const computedMaxDate = useMemo(() => maxDateOverride, [maxDateOverride]);

    const excluded = useMemo<Date[]>(() => {
      return excludedDates.map((item) => parseISO(item.date as string)).filter(isValid);
    }, [excludedDates]);

    // @ts-ignore
    const selected = useMemo(() => {
      if (!savedDate) return null;
      const d = parse(savedDate, 'dd-MM-yyyy', new Date(), { locale: fr });
      if (!isValid(d)) return null;
      // If overrides are provided, hide selected date if it falls outside the allowed window
      if (computedMinDate && isBefore(d, computedMinDate)) return null;
      if (computedMaxDate && isAfter(d, computedMaxDate)) return null;
      return d;
    }, [savedDate, computedMinDate, computedMaxDate]);

    const handleSelect = async (d: Date | null) => {
      if (!d) return;
      const frFmt = format(d, 'dd-MM-yyyy');
      setDate(frFmt);
      try {
        // @ts-ignore
        const state = window.Snipcart.store.getState();
        const existing: Array<{ name: string; value: string }> = state.cart.customFields || [];
        const others = existing.filter((f) => f.name !== 'Date de retrait');

        // @ts-ignore
        await window.Snipcart.api.cart.update({
          customFields: [...others, { name: 'Date de retrait', value: frFmt }],
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
          minDate={computedMinDate}
          maxDate={computedMaxDate}
          startDate={now}
          locale="fr"
          dateFormat="dd/MM/yyyy"
          excludeDates={excluded}
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
          // @ts-ignore
          ref={ref}
          wrapperClassName="w-full"
        />
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
export default DatePicker;
