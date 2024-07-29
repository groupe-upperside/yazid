import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import React from 'react';

import Divider from '@/components/Divider';

/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

const ActiveTimeline = ({ activeDateItem }) => {
  return (
    <li className="flex w-fit items-center">
      <div className="relative flex flex-col items-center">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-xl font-medium text-white xl:size-28 xl:text-2xl">
          {activeDateItem.year}
        </span>
      </div>
      <div className="w-8 flex-auto border-t-2 border-black xl:w-12"></div>
    </li>
  );
};

const EmptyTimeline = ({ isLast }) => {
  return (
    <li className={`flex w-fit items-center ${isLast ? 'border-t-0' : ''}`}>
      <div className="relative flex flex-col items-center">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-black xl:size-12"></span>
      </div>
      <div className={`w-8 flex-auto border-t-2 border-black xl:w-12 ${isLast ? 'border-t-0' : ''}`}></div>
    </li>
  );
};

const InactiveTimeline = ({ inactiveDateItem }) => {
  return (
    <li className="flex w-fit items-center">
      <div className="relative flex flex-col items-center">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-black text-lg font-semibold text-black xl:size-20 xl:text-xl">
          {inactiveDateItem.year}
        </span>
      </div>
      <div className="w-8 flex-auto border-t-2 border-black xl:w-12"></div>
    </li>
  );
};

/**
 * Component for "Timeline" Slices.
 */
const Timeline = ({ slice }: TimelineProps): JSX.Element => {
  const dateItems = slice.primary.date;
  const activeDateItem = dateItems[0];
  const inactiveDateItems = dateItems.slice(1);
  const inactiveDateItemsCount = inactiveDateItems.length;
  const leftInactiveDateItemsCount = Math.floor(inactiveDateItemsCount / 2);
  const rightInactiveDateItemsCount = inactiveDateItemsCount - leftInactiveDateItemsCount;
  const leftInactiveDateItems = inactiveDateItems.slice(0, leftInactiveDateItemsCount);
  const rightInactiveDateItems = inactiveDateItems.slice(leftInactiveDateItemsCount);

  const totalEmptyTimelinesXL = 3;
  const totalEmptyTimelinesLG = 2;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] p-20 font-avenir tracking-widest xl:p-32"
    >
      <div className="me-auto place-self-center xl:col-span-7">
        <h2 className="mb-3 text-center text-2xl uppercase text-gray-900 md:text-3xl">
          {slice.primary.title}
          <br />
          <span className="font-semibold">{slice.primary.title_bold}</span>
        </h2>
        <Divider centered={true} />
        <div className="space-y-6">
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => <p className="text-center tracking-widest text-[#707070]">{children}</p>,
            }}
          />
        </div>
      </div>
      <div className="pt-16 xl:pt-24">
        <ol className="mx-auto flex max-w-screen-2xl items-center justify-center overflow-auto">
          {/* Left empty timelines for XL screens */}
          <div className="hidden w-fit justify-center xl:flex">
            {[...Array(totalEmptyTimelinesXL)].map((_, index) => (
              <EmptyTimeline key={index} isLast={false} />
            ))}
          </div>
          {/* Left empty timelines for LG screens */}
          <div className="hidden w-fit justify-center lg:flex xl:hidden">
            {[...Array(totalEmptyTimelinesLG)].map((_, index) => (
              <EmptyTimeline key={index} isLast={false} />
            ))}
          </div>
          {/* Left empty timeline for smaller screens */}
          <div className="flex w-fit justify-center lg:hidden">
            <EmptyTimeline isLast={false} />
          </div>
          {/* Left inactive timelines */}
          {leftInactiveDateItems.map((inactiveDateItem, index) => (
            <InactiveTimeline inactiveDateItem={inactiveDateItem} key={index} />
          ))}
          {/* Active timeline */}
          <ActiveTimeline activeDateItem={activeDateItem} />
          {/* Right inactive timelines */}
          {rightInactiveDateItems.map((inactiveDateItem, index) => (
            <InactiveTimeline inactiveDateItem={inactiveDateItem} key={index} />
          ))}
          {/* Right empty timelines for XL screens */}
          <div className="hidden w-fit justify-center xl:flex">
            {[...Array(totalEmptyTimelinesXL)].map((_, index) => (
              <EmptyTimeline key={index} isLast={index === totalEmptyTimelinesXL - 1} />
            ))}
          </div>
          {/* Right empty timelines for LG screens */}
          <div className="hidden w-fit justify-center lg:flex xl:hidden">
            {[...Array(totalEmptyTimelinesLG)].map((_, index) => (
              <EmptyTimeline key={index} isLast={index === totalEmptyTimelinesLG - 1} />
            ))}
          </div>
          {/* Right empty timeline for smaller screens */}
          <div className="flex w-fit justify-center lg:hidden">
            <EmptyTimeline isLast={true} />
          </div>
        </ol>
        <div className="mx-auto mt-4 flex w-full max-w-lg flex-col items-center justify-between gap-y-4">
          <div className="text-center font-semibold uppercase">{activeDateItem.title}</div>
          <div className="space-y-6">
            <PrismicRichText
              field={activeDateItem.description}
              components={{
                paragraph: ({ children }) => <p className="text-center tracking-widest text-[#707070]">{children}</p>,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
