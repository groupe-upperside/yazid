import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import React from 'react';

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
        <span className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-xl font-medium text-white xl:size-28 xl:text-2xl">
          {activeDateItem ? activeDateItem.year : ''}
        </span>
      </div>
      <div className="w-8 flex-auto border-t-2 border-black xl:w-12"></div>
    </li>
  );
};

interface EmptyTimelineProps {
  isLast: boolean;
}

const EmptyTimeline = ({ isLast }: EmptyTimelineProps) => {
  return (
    <li className={`flex w-fit items-center`}>
      <div className="relative flex flex-col items-center">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-black xl:size-12"></span>
      </div>
      <div className={`w-8 flex-auto border-black xl:w-12 ${isLast ? 'border-t-0' : 'border-t-2'}`}></div>
    </li>
  );
};

interface InactiveTimelineProps {
  inactiveDateItem: Simplify<Content.TimelineSliceDefaultPrimaryDateItem>;
  isLeft: boolean;
}

const InactiveTimeline = ({ inactiveDateItem, isLeft }: InactiveTimelineProps) => {
  return (
    <li className="flex w-fit items-center">
      {isLeft ? <div className="w-8 flex-auto border-t-2 border-black md:hidden xl:w-12"></div> : null}
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
  const leftInactiveDateItems = inactiveDateItems.slice(0, leftInactiveDateItemsCount);
  const rightInactiveDateItems = inactiveDateItems.slice(leftInactiveDateItemsCount);

  const totalEmptyTimelinesXL = 3;
  const totalEmptyTimelinesLG = 2;

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
      <div className="pt-16 xl:pt-24">
        <ol className="mx-auto flex max-w-screen-2xl items-center justify-center overflow-auto">
          {/* Left empty timelines for XL screens */}
          <div className="hidden w-fit justify-center xl:flex">
            {[...Array(totalEmptyTimelinesXL)].map((_, index) => (
              <EmptyTimeline key={index} isLast={false} />
            ))}
          </div>
          <div className="hidden w-fit justify-center lg:flex xl:hidden">
            {[...Array(totalEmptyTimelinesLG)].map((_, index) => (
              <EmptyTimeline key={index} isLast={false} />
            ))}
          </div>
          <div className="hidden w-fit justify-center md:flex lg:hidden">
            <EmptyTimeline isLast={false} />
          </div>
          {leftInactiveDateItems.map((inactiveDateItem, index) => (
            <InactiveTimeline inactiveDateItem={inactiveDateItem} key={index} isLeft={true} />
          ))}
          <ActiveTimeline activeDateItem={activeDateItem} />
          {rightInactiveDateItems.map((inactiveDateItem, index) => (
            <InactiveTimeline inactiveDateItem={inactiveDateItem} key={index} isLeft={false} />
          ))}
          <div className="hidden w-fit justify-center xl:flex">
            {[...Array(totalEmptyTimelinesXL)].map((_, index) => (
              <EmptyTimeline key={index} isLast={index === totalEmptyTimelinesXL - 1} />
            ))}
          </div>
          <div className="hidden w-fit justify-center lg:flex xl:hidden">
            {[...Array(totalEmptyTimelinesLG)].map((_, index) => (
              <EmptyTimeline key={index} isLast={index === totalEmptyTimelinesLG - 1} />
            ))}
          </div>
          <div className="hidden w-fit justify-center md:flex lg:hidden">
            <EmptyTimeline isLast={true} />
          </div>
        </ol>
        {activeDateItem ? (
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
        ) : null}
      </div>
    </section>
  );
};

export default Timeline;
