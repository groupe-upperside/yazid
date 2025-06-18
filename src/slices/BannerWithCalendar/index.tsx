'use client';

import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import CartRows from '@/components/CartRows';
import DatePicker from '@/components/DatePicker';
import SectionTitle from '@/components/SectionTitle';
import TimeSlotPicker from '@/components/TimeSlotPicker';

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
    upper_separator_text,
    title_bold,
    lower_separator_text,
    pick_up_date_title,
    pick_up_date_description,
    pick_up_date_day,
    pick_up_date_slot,
    padding_bottom,
    pick_up_date_title_uppercase,
    button_position,
    width,
    include_cart,
  } = slice.primary;

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
            <DatePicker placeholder={pick_up_date_day} />
            <TimeSlotPicker placeholder={pick_up_date_slot} />
          </div>
        </div>
        {include_cart ? <CartRows isCheckoutPage={true} /> : null}
      </div>
    </section>
  );
};

export default BannerWithCalendar;
