'use client';

import 'react-datepicker/dist/react-datepicker.css';

import type { GroupField, KeyTextField } from '@prismicio/client';
import { format, isValid, max, parse, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { usePathname } from 'next/navigation';
import { forwardRef, useEffect, useMemo } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FaRegCalendar } from 'react-icons/fa';

import { useCartCustomFields, useCartItems } from '@/hooks/useSnipcart';
import { getOrderableWindow, type OrderableWindow } from '@/utils/orderableDates';

registerLocale('fr', fr);

type Props = {
  placeholder: KeyTextField;
  excludedDates: GroupField;
  minDate?: Date;
};

const ALLOWED_OVERRIDE_DATES: Date[] = [startOfDay(new Date(2026, 4, 31))];

const isAllowedOverride = (date: Date) => ALLOWED_OVERRIDE_DATES.some((d) => d.getTime() === date.getTime());

// Products may restrict pickup to an inclusive date range (set in Prismic); the cart keeps the intersection.
const isBlockedDate = (date: Date, excludedDates: Date[], orderable: OrderableWindow) => {
  const day = startOfDay(date);
  if (orderable.status === 'unavailable') return true;
  if (orderable.status === 'ok') {
    if (orderable.start && day < orderable.start) return true;
    if (orderable.end && day > orderable.end) return true;
  }
  if (excludedDates.some((ex) => ex.getTime() === day.getTime())) return true;
  if (isAllowedOverride(day)) return false;
  return day.getDay() === 0 || day.getDay() === 1;
};

const getRestrictionMessage = (start: Date | null, end: Date | null, isFr: boolean) => {
  const fmt = (d: Date) => format(d, 'dd/MM/yyyy');
  if (start && end) {
    return isFr
      ? `En raison d'un produit de votre panier, le retrait est disponible uniquement du ${fmt(start)} au ${fmt(end)}.`
      : `Due to an item in your cart, pickup is only available from ${fmt(start)} to ${fmt(end)}.`;
  }
  if (start) {
    return isFr
      ? `En raison d'un produit de votre panier, le retrait est disponible à partir du ${fmt(start)}.`
      : `Due to an item in your cart, pickup is only available from ${fmt(start)}.`;
  }
  return isFr
    ? `En raison d'un produit de votre panier, le retrait est disponible jusqu'au ${fmt(end as Date)}.`
    : `Due to an item in your cart, pickup is only available until ${fmt(end as Date)}.`;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(({ placeholder, excludedDates, minDate }, ref) => {
  const { 'Date de retrait': savedDate } = useCartCustomFields(['Date de retrait']);
  const { items } = useCartItems();
  const pathname = usePathname();
  const isFr = (pathname?.split('/')[1] ?? 'fr').includes('fr');

  const orderable = useMemo(() => getOrderableWindow(items), [items]);

  const effectiveMinDate = useMemo(() => {
    const base = minDate ? startOfDay(minDate) : startOfDay(new Date());
    return orderable.status === 'ok' && orderable.start ? max([base, orderable.start]) : base;
  }, [minDate, orderable]);

  const effectiveMaxDate = orderable.status === 'ok' ? (orderable.end ?? undefined) : undefined;

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
    if (isBlockedDate(sd, excluded, orderable)) return null;

    return d;
  }, [savedDate, effectiveMinDate, excluded, orderable]);

  // Clear a persisted pickup date that is no longer valid (e.g. now blocked, in
  // the past, or outside the restricted window after a restricted product was
  // added) so the cart can't reach checkout with a stale date.
  useEffect(() => {
    if (!savedDate || selected !== null) return;

    (async () => {
      try {
        // @ts-ignore
        const state = window.Snipcart?.store?.getState();
        if (!state) return;
        const existing: Array<{ name: string; value: string }> = state.cart.customFields || [];
        if (!existing.some((f) => f.name === 'Date de retrait')) return;
        const others = existing.filter((f) => f.name !== 'Date de retrait');

        // @ts-ignore
        await window.Snipcart.api.cart.update({ customFields: others });
      } catch (err) {
        console.error('Failed to clear stale Date de retrait:', err);
      }
    })();
  }, [savedDate, selected]);

  const handleSelect = async (d: Date | null) => {
    if (!d) return;

    const sd = startOfDay(d);

    if (sd < effectiveMinDate) return;
    if (isBlockedDate(sd, excluded, orderable)) return;

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
    <div className="mx-auto inline-block w-48 xl:w-52">
      <div className="relative w-full">
        <ReactDatePicker
          calendarClassName="calendar-classname"
          dayClassName={(d) => (selected && d.toDateString() === selected.toDateString() ? 'day-classname' : '')}
          selected={selected}
          onChange={handleSelect}
          minDate={effectiveMinDate}
          maxDate={effectiveMaxDate}
          openToDate={selected ?? effectiveMinDate}
          disabled={orderable.status === 'unavailable'}
          excludeDates={excluded}
          filterDate={(date) => !isBlockedDate(date, excluded, orderable)}
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
      {orderable.status === 'ok' && (
        <p className="paragraph-style mt-2 text-left text-sm font-medium tracking-widest text-gray-400 md:text-base">
          {getRestrictionMessage(orderable.start, orderable.end, isFr)}
        </p>
      )}
      {orderable.status === 'unavailable' && (
        <p className="paragraph-style mt-2 text-left text-sm font-medium tracking-widest text-red-500 md:text-base">
          {isFr
            ? `Aucune date de retrait commune n'est disponible pour les articles de votre panier (${orderable.names.join(', ')}). Veuillez en retirer un pour pouvoir commander.`
            : `No common pickup date is available for the items in your cart (${orderable.names.join(', ')}). Please remove one to place your order.`}
        </p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
