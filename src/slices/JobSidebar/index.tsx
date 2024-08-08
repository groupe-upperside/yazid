import type { Content } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { FaCalendarAlt, FaFacebook, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaTwitter } from 'react-icons/fa';
import { IoRocketOutline } from 'react-icons/io5';
import { LuLuggage } from 'react-icons/lu';
import { PiClock } from 'react-icons/pi';
import { VscBook } from 'react-icons/vsc';

/**
 * Props for `JobSidebar`.
 */
export type JobSidebarProps = SliceComponentProps<Content.JobSidebarSlice>;

/**
 * Component for "JobSidebar" Slices.
 */
const JobSidebar = ({ slice }: JobSidebarProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col gap-y-6 bg-[#F7F4EF] p-6"
    >
      <div className="flex w-full justify-center">
        <a
          href="mailto:l.truc@groupe-upperside.com"
          className="mx-auto mt-8 bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
        >
          {slice.primary.cta_title}
        </a>
      </div>
      <p className="mt-6 text-justify text-base font-bold tracking-widest text-black md:text-lg">
        {slice.primary.summary_title}
      </p>
      <p className="flex items-center gap-2">
        <span>
          <FaMapMarkerAlt />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">{slice.primary.city}</span>
      </p>
      <p className="flex items-center gap-2">
        <span>
          <LuLuggage />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">
          {slice.primary.contract_type}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <span>
          <FaCalendarAlt />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">
          {slice.primary.published_at}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <span>
          <VscBook />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">{slice.primary.experience}</span>
      </p>
      <p className="flex items-center gap-2">
        <span>
          <PiClock />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">
          {slice.primary.hours_per_week}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <span>
          <IoRocketOutline />
        </span>
        <span className="text-justify text-sm tracking-widest text-black md:text-base">
          {slice.primary.hiring_date}
        </span>
      </p>
      <p className="mt-6 text-justify text-base font-bold tracking-widest text-black md:text-lg">
        {slice.primary.share_title}
      </p>
      <div className="flex gap-4">
        <a href="https://facebook.com" target="_blank">
          <FaFacebook className="size-10" />
        </a>
        <a href="https://twitter.com" target="_blank">
          <FaTwitter className="size-10 rounded-full bg-black p-2 text-white" />
        </a>
        <a href="https://linkedin.com" target="_blank">
          <FaLinkedinIn className="size-10 rounded-full bg-black p-2 text-white" />
        </a>
        <a href="https://instagram.com" target="_blank">
          <FaInstagram className="size-10 rounded-full bg-black p-2 text-white" />
        </a>
      </div>
      <PrismicNextLink
        field={slice.primary.link_to_all_job_offers}
        className="mt-6 text-justify text-base font-bold tracking-widest text-black underline md:text-lg"
      >
        {slice.primary.see_all_offers_title}
      </PrismicNextLink>
    </section>
  );
};

export default JobSidebar;
