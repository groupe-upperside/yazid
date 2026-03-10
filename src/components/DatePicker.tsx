'use client';

import 'react-datepicker/dist/react-datepicker.css';

import type { GroupField, KeyTextField } from '@prismicio/client';
import { format, isValid, parse, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { forwardRef, useMemo } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FaRegCalendar } from 'react-icons/fa';

import { useCartCustomFields } from '@/hooks/useSnipcart';

registerLocale('fr', fr);

type Props = {
  placeholder: KeyTextField;
  excludedDates: GroupField;
  minDate?: Date;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(({ placeholder, excludedDates, minDate }, ref) => {
  const { 'Date de retrait': savedDate } = useCartCustomFields(['Date de retrait']);

  const effectiveMinDate = useMemo(() => {
    return minDate ? startOfDay(minDate) : startOfDay(new Date());
  }, [minDate]);

  const excluded = useMemo<Date[]>(() => {
    return excludedDates
      .map((item) => parseISO(item.date as string))
      .filter(isValid)
      .map((d) => startOfDay(d));
  }, [excludedDates]);

  const selected = useMemo(() => {
    if (!savedDate) return null;

    const d = parse(savedDate, 'dd-MM-yyyy', new Date(), { locale: fr });
    if (!isValid(d)) return null;

    const sd = startOfDay(d);

    if (sd < effectiveMinDate) return null;
    if (excluded.some((ex) => ex.getTime() === sd.getTime())) return null;

    return d;
  }, [savedDate, effectiveMinDate, excluded]);

  const handleSelect = async (d: Date | null) => {
    if (!d) return;

    const sd = startOfDay(d);

    if (sd < effectiveMinDate) return;
    if (excluded.some((ex) => ex.getTime() === sd.getTime())) return;

    const frFmt = format(d, 'dd-MM-yyyy');

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
        minDate={effectiveMinDate}
        excludeDates={excluded}
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
        // @ts-ignore
        ref={ref}
        wrapperClassName="w-full"
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
