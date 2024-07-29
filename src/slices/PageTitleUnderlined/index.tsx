import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `PageTitleUnderlined`.
 */
export type PageTitleUnderlinedProps = SliceComponentProps<Content.PageTitleUnderlinedSlice>;

/**
 * Component for "PageTitleUnderlined" Slices.
 */
const PageTitleUnderlined = ({ slice }: PageTitleUnderlinedProps): JSX.Element => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <h2 className="text-2xl font-semibold uppercase tracking-widest text-[#707070] md:text-3xl text-center py-3">
        {slice.primary.title}
      </h2>
      <hr className="bg-[#747474] h-0.5" />
    </section>
  );
};

export default PageTitleUnderlined;
