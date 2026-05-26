'use client';

import 'react-datepicker/dist/react-datepicker.css';

import type { GroupField, KeyTextField } from '@prismicio/client';
import { format, isValid, parse, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { usePathname } from 'next/navigation';
import { forwardRef, useEffect, useMemo } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { FaRegCalendar } from 'react-icons/fa';

import { useCartCustomFields, useCartItems } from '@/hooks/useSnipcart';

registerLocale('fr', fr);

type Props = {
  placeholder: KeyTextField;
  excludedDates: GroupField;
  minDate?: Date;
};

const ALLOWED_OVERRIDE_DATES: Date[] = [startOfDay(new Date(2026, 4, 31))];

const isAllowedOverride = (date: Date) => ALLOWED_OVERRIDE_DATES.some((d) => d.getTime() === date.getTime());

// When the cart contains any of these products, pickup is restricted to the dates below.
const RESTRICTED_PRODUCT_IDS = ['41', '42', '43', '44', '45'];
const RESTRICTED_PICKUP_DATES: Date[] = [startOfDay(new Date(2026, 4, 30)), startOfDay(new Date(2026, 4, 31))];

const isRestrictedPickupDate = (date: Date) =>
  RESTRICTED_PICKUP_DATES.some((d) => d.getTime() === startOfDay(date).getTime());

const isBlockedDate = (date: Date, excludedDates: Date[], restrictToPickupDates: boolean) => {
  const day = startOfDay(date);
  if (restrictToPickupDates) return !isRestrictedPickupDate(day);
  if (excludedDates.some((ex) => ex.getTime() === day.getTime())) return true;
  if (isAllowedOverride(day)) return false;
  return day.getDay() === 0 || day.getDay() === 1;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(({ placeholder, excludedDates, minDate }, ref) => {
  const { 'Date de retrait': savedDate } = useCartCustomFields(['Date de retrait']);
  const { items } = useCartItems();
  const pathname = usePathname();
  const isFr = (pathname?.split('/')[1] ?? 'fr').includes('fr');

  const restrictToPickupDates = useMemo(
    () => items.some((it) => RESTRICTED_PRODUCT_IDS.includes(String(it.id))),
    [items]
  );

  const effectiveMinDate = useMemo(() => {
    if (restrictToPickupDates) return RESTRICTED_PICKUP_DATES[0];
    return minDate ? startOfDay(minDate) : startOfDay(new Date());
  }, [minDate, restrictToPickupDates]);

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
    if (isBlockedDate(sd, excluded, restrictToPickupDates)) return null;

    return d;
  }, [savedDate, effectiveMinDate, excluded, restrictToPickupDates]);

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
    if (isBlockedDate(sd, excluded, restrictToPickupDates)) return;

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
          excludeDates={excluded}
          filterDate={(date) => !isBlockedDate(date, excluded, restrictToPickupDates)}
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
      {restrictToPickupDates && (
        <p className="paragraph-style mt-2 text-left text-sm font-medium tracking-widest text-gray-400 md:text-base">
          {isFr
            ? "En raison d'un produit de votre panier, le retrait est disponible uniquement le 30 ou 31 mai."
            : 'Due to an item in your cart, pickup is only available on May 30 or 31.'}
        </p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
