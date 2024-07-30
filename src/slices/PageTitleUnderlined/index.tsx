import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';

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
      <h2 className="py-4 text-center text-2xl font-semibold uppercase tracking-widest text-[#707070] md:text-3xl">
        {slice.primary.title}
      </h2>
      <hr className="h-0.5 bg-[#747474]" />
    </section>
  );
};

export default PageTitleUnderlined;
