import type { Content } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

/**
 * Props for `JobOffers`.
 */
export type JobOffersProps = SliceComponentProps<Content.JobOffersSlice>;

/**
 * Component for "JobOffers" Slices.
 */
const JobOffers = ({ slice }: JobOffersProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] bg-opacity-50 p-12 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <SectionTitle text={slice.primary.title} bold={true} centered={true} />
      <Divider centered={true} />
      <div className="space-y-4">
        {slice.primary.job.map((job, index) => (
          <div key={index} className="grid grid-cols-4 bg-white p-5">
            <p className="flex items-center justify-center text-sm font-medium tracking-widest text-black md:text-base">
              {job.job_title}
            </p>
            <p className="flex items-center justify-center text-sm font-medium tracking-widest text-black md:text-base">
              {job.contract_type}
            </p>
            <p className="flex items-center justify-center text-sm font-medium tracking-widest text-black md:text-base">
              {job.hiring_date}
            </p>
            <PrismicNextLink
              field={job.link_to_job_page}
              className="flex w-full items-center justify-center text-sm font-medium tracking-widest"
            >
              <IoIosArrowRoundForward className="size-8 text-[#D4D4D4]" />
            </PrismicNextLink>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobOffers;
