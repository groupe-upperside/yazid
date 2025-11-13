'use client';

import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import { useMemo } from 'react';

import CartRows from '@/components/CartRows';
import DatePicker from '@/components/DatePicker';
import SectionTitle from '@/components/SectionTitle';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import { useCartItems } from '@/hooks/useSnipcart';

/**
 * Props for `BannerWithCalendar`.
 */
export type BannerWithCalendarProps = SliceComponentProps<Content.BannerWithCalendarSlice>;

/**
 * Reusable PrismicRichText component
 */
const ReusablePrismicRichText = ({ field, centered = false }: { field: any; centered: boolean }) => (
  <PrismicRichText
    field={field}
    components={{
      paragraph: ({ children }) => (
        <p
          className={`paragraph-style ${centered ? 'text-center' : 'text-left'} text-sm font-medium tracking-widest text-gray-400 md:text-base`}
        >
          {children}
        </p>
      ),
      list: ({ children }) => (
        <ul className="list-style list-inside list-disc tracking-widest text-gray-500">{children}</ul>
      ),
    }}
  />
);

/**
 * Component for "BannerWithCalendar" Slices.
 */
const BannerWithCalendar = ({ slice }: BannerWithCalendarProps): JSX.Element => {
  const {
    // @ts-ignore
    upper_separator_text,
    title_bold,
    // @ts-ignore
    lower_separator_text,
    pick_up_date_title,
    pick_up_date_description,
    pick_up_date_day,
    pick_up_date_slot,
    // @ts-ignore
    padding_bottom,
    pick_up_date_title_uppercase,
    button_position,
    // @ts-ignore
    width,
    // @ts-ignore
    include_cart,
    excluded_dates,
  } = slice.primary;

  const { items } = useCartItems();

  const christmasIds = [32, 33];
  const kingsDayIds = [34, 35, 36];

  const hasChristmasItem = useMemo(() => {
    if (!items || !Array.isArray(items)) return false;
    try {
      return items.some((it: any) => {
        const raw = (it && (it.id ?? it.productId ?? it.slug ?? '')) as string;
        const num = parseInt(raw as string, 10);
        return Number.isInteger(num) && christmasIds.includes(num);
      });
    } catch {
      return false;
    }
  }, [items]);

  const hasKingsDayItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return false;
    try {
      return items.some((it: any) => {
        const raw = (it && (it.id ?? it.productId ?? it.slug ?? '')) as string;
        const num = parseInt(raw as string, 10);
        return Number.isInteger(num) && kingsDayIds.includes(num);
      });
    } catch {
      return false;
    }
  }, [items]);

  const dateOverrides = useMemo(() => {
    // Default: no overrides
    if (!hasChristmasItem && !hasKingsDayItems) {
      return {} as Record<string, Date>;
    }

    let min: Date;
    let max: Date;

    if (hasKingsDayItems) {
      // King's Day dates take priority
      min = new Date(2026, 0, 2); // Jan 2, 2026
      max = new Date(2026, 0, 30); // Jan 30, 2026
    } else if (hasChristmasItem) {
      // Christmas dates only if no King's Day items
      min = new Date(2025, 11, 19); // Dec 19, 2025
      max = new Date(2026, 0, 3); // Jan 3, 2026
    }

    return {
      minDateOverride: min!,
      maxDateOverride: max!,
    } as { minDateOverride: Date; maxDateOverride: Date };
  }, [hasChristmasItem, hasKingsDayItems]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={width ? `lg:${width} w-full` : 'w-full'}
    >
      <div
        className={`bg-[#F7F4EF] ${padding_bottom || 'pb-12 md:pb-20 xl:pb-32'} font-avenir tracking-widest ${!width ? 'px-6 pt-12 md:px-20 md:pt-20 xl:px-32 xl:pt-32 ' : ''}`}
      >
        {title_bold ? <SectionTitle text={title_bold} bold={true} centered={true} /> : null}
        {slice.variation === 'default' && (
          <>
            {isFilled.richText(upper_separator_text) && (
              <div className="space-y-2">
                <ReusablePrismicRichText centered={true} field={upper_separator_text} />
              </div>
            )}
            <hr className="border-0.5 m-6 mx-auto flex h-0.5 w-28 border-gray-400" />
            {isFilled.richText(lower_separator_text) && (
              <div className="space-y-2">
                <ReusablePrismicRichText centered={true} field={lower_separator_text} />
              </div>
            )}
          </>
        )}

        <div
          className={`${include_cart ? 'mt-8 gap-4' : 'mt-6 gap-10'} items-center justify-between bg-white p-6 ${button_position === 'right' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
        >
          <div className="space-y-4">
            <p
              className={`text-left text-sm font-bold tracking-widest text-black md:text-base ${pick_up_date_title_uppercase ? 'uppercase' : ''}`}
            >
              {pick_up_date_title}
            </p>
            <div className="space-y-2">
              <ReusablePrismicRichText field={pick_up_date_description} centered={false} />
            </div>
          </div>
          <div className={`flex gap-6 ${button_position === 'right' ? 'flex-col' : 'flex-col md:flex-row'}`}>
            <DatePicker placeholder={pick_up_date_day} excludedDates={excluded_dates} {...dateOverrides} />
            <TimeSlotPicker placeholder={pick_up_date_slot} />
          </div>
        </div>
        {include_cart ? <CartRows isCheckoutPage={true} /> : null}
      </div>
    </section>
  );
};

export default BannerWithCalendar;
