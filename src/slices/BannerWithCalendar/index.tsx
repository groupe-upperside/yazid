'use client';

import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import { useState } from 'react';

import DatePicker from '@/components/DatePicker';
import SectionTitle from '@/components/SectionTitle';
import TimeSlotPicker from '@/components/TimeSlotPicker';

/**
 * Props for `BannerWithCalendar`.
 */
export type BannerWithCalendarProps = SliceComponentProps<Content.BannerWithCalendarSlice>;

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
  } = slice.primary;

  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const isValidDay = (iso: string) => {
    if (!iso) return false;
    const d = new Date(iso);
    const day = d.getDay();
    return day >= 2 && day <= 6;
  };

  const ready = isValidDay(date) && slot;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="bg-[#F7F4EF] p-12 font-avenir tracking-widest md:p-20 xl:p-32">
        <SectionTitle text={title_bold} bold={true} centered={true} />
        {isFilled.richText(upper_separator_text) && (
          <>
            <div className="space-y-2">
              <PrismicRichText
                field={upper_separator_text}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-center text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
                      {children}
                    </p>
                  ),
                  list: ({ children }) => (
                    <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                  ),
                }}
              />
            </div>
          </>
        )}
        <hr className="border-0.5 m-6 mx-auto flex h-0.5 w-28 border-[#9A9A9A]" />
        {isFilled.richText(lower_separator_text) && (
          <>
            <div className="space-y-2">
              <PrismicRichText
                field={lower_separator_text}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-center text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
                      {children}
                    </p>
                  ),
                  list: ({ children }) => (
                    <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                  ),
                }}
              />
            </div>
          </>
        )}
        <div className="mt-6 flex flex-col items-center justify-between gap-10 bg-white p-6 sm:flex-row">
          <div className="space-y-4">
            <p className="text-left text-sm font-bold tracking-widest text-black md:text-base">{pick_up_date_title}</p>
            <div className="space-y-2">
              <PrismicRichText
                field={pick_up_date_description}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-left-center text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
                      {children}
                    </p>
                  ),
                  list: ({ children }) => (
                    <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                  ),
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <DatePicker value={date} onChange={setDate} min={minDate} placeholder={pick_up_date_day} />
            <TimeSlotPicker value={slot} onChange={setSlot} placeholder={pick_up_date_slot} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerWithCalendar;
