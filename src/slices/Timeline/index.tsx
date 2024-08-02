'use client';

import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import React, { useEffect, useState } from 'react';

import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

import type { Simplify } from '../../../prismicio-types';

/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

interface ActiveDateItemProps {
  activeDateItem: Simplify<Content.TimelineSliceDefaultPrimaryDateItem> | undefined;
}

const ActiveTimeline = ({ activeDateItem }: ActiveDateItemProps) => {
  return (
    <li className="flex w-fit items-center">
      <div className="relative flex flex-col items-center">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-lg font-medium text-white xl:size-20 xl:text-xl">
          {activeDateItem ? activeDateItem.year : ''}
        </span>
      </div>
      <div className="w-6 flex-auto border-t border-black xl:w-12"></div>
    </li>
  );
};

interface InactiveTimelineProps {
  inactiveDateItem: Simplify<Content.TimelineSliceDefaultPrimaryDateItem>;
  isLeft: boolean;
  isLast?: boolean;
}

const InactiveTimeline = ({ inactiveDateItem, isLeft, isLast }: InactiveTimelineProps) => {
  return (
    <li className="flex w-fit items-center">
      {isLeft ? <div className="w-6 flex-auto border-t border-black md:hidden xl:w-12"></div> : null}
      <div className="relative flex flex-col items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black text-base font-semibold text-black xl:size-16 xl:text-lg">
          {inactiveDateItem.year}
        </span>
      </div>
      {!isLast && <div className="w-6 flex-auto border-t border-black xl:w-12"></div>}
    </li>
  );
};

/**
 * Component for "Timeline" Slices.
 */
const Timeline = ({ slice }: TimelineProps): JSX.Element => {
  const dateItems = slice.primary.date;
  const [currentIndex, setCurrentIndex] = useState(Math.floor(dateItems.length / 2));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? dateItems.length - 1 : prevIndex - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex === dateItems.length - 1 ? 0 : prevIndex + 1));
  };

  const getVisibleItems = () => {
    const leftCount = isMobile ? 1 : 2;
    const rightCount = isMobile ? 1 : 2;

    const totalItems = dateItems.length;
    const leftItems = [];
    const rightItems = [];

    for (let i = 1; i <= leftCount; i + 1) {
      leftItems.unshift(dateItems[(currentIndex - i + totalItems) % totalItems]);
    }

    for (let i = 1; i <= rightCount; i + 1) {
      rightItems.push(dateItems[(currentIndex + i) % totalItems]);
    }

    return [...leftItems, dateItems[currentIndex], ...rightItems];
  };

  const visibleItems = getVisibleItems();

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] p-12 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="me-auto place-self-center xl:col-span-7">
        <SectionTitle text={slice.primary.title} centered={true} />
        <SectionTitle text={slice.primary.title_bold} bold={true} centered={true} />
        <Divider centered={true} />
        <div className="space-y-6">
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-center md:text-base">
                  {children}
                </p>
              ),
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-16 xl:pt-24">
        <div className="flex items-center justify-center space-x-4 lg:space-x-12">
          <button
            className="rounded-full bg-black p-1 text-white hover:text-gray-900 group-focus:text-gray-900 lg:p-2 dark:hover:text-white dark:group-focus:text-white"
            onClick={scrollLeft}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="mi-solid mi-chevron-left"
              viewBox="0 0 24 24"
            >
              <path d="M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41" />
            </svg>
            <span className="sr-only">Previous</span>
          </button>
          <div className="mx-auto flex max-w-screen-2xl items-center justify-center overflow-hidden">
            <div className="scrollbar-hide flex overflow-x-auto">
              {visibleItems.map((item, index) => {
                const isLast = index === visibleItems.length - 1;
                if (item.year === dateItems[currentIndex].year) {
                  return <ActiveTimeline activeDateItem={item} key={index} />;
                }
                return (
                  <InactiveTimeline
                    inactiveDateItem={item}
                    key={index}
                    isLeft={
                      item.year && dateItems[currentIndex].year
                        ? item.year < (dateItems[currentIndex].year as string)
                        : false
                    }
                    isLast={isLast}
                  />
                );
              })}
            </div>
          </div>
          <button
            className="rounded-full bg-black p-1 text-white hover:text-gray-900 group-focus:text-gray-900 lg:p-2 dark:hover:text-white dark:group-focus:text-white"
            onClick={scrollRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="mi-solid mi-chevron-right"
              viewBox="0 0 24 24"
            >
              <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01" />
            </svg>
            <span className="sr-only">Next</span>
          </button>
        </div>
        {dateItems[currentIndex] ? (
          <div className="mx-auto mt-4 flex w-full max-w-lg flex-col items-center justify-between gap-y-4">
            <div className="text-center text-sm font-semibold uppercase">{dateItems[currentIndex].title}</div>
            <div className="space-y-6">
              <PrismicRichText
                field={dateItems[currentIndex].description}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-center text-sm tracking-widest text-[#707070]">{children}</p>
                  ),
                }}
              />
            </div>
            {isFilled.keyText(dateItems[currentIndex].title_2) ? (
              <>
                <div className="text-center text-sm font-semibold uppercase">{dateItems[currentIndex].title_2}</div>
                <div className="space-y-6">
                  <PrismicRichText
                    field={dateItems[currentIndex].description_2}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-center tracking-widest text-[#707070]">{children}</p>
                      ),
                    }}
                  />
                </div>
                {isFilled.keyText(dateItems[currentIndex].title_3) ? (
                  <>
                    <div className="text-center text-sm font-semibold uppercase">{dateItems[currentIndex].title_3}</div>
                    <div className="space-y-6">
                      <PrismicRichText
                        field={dateItems[currentIndex].description_3}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="text-center text-sm tracking-widest text-[#707070]">{children}</p>
                          ),
                        }}
                      />
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Timeline;
