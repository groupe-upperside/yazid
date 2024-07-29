import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `BannerWithText`.
 */
export type BannerWithTextProps = SliceComponentProps<Content.BannerWithTextSlice>;

/**
 * Component for "BannerWithText" Slices.
 */
const BannerWithText = ({ slice }: BannerWithTextProps): JSX.Element => {
  const backgroundImageUrl = slice.primary.image.url;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative h-[40rem] xl:h-[45rem]"
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <PrismicNextImage field={slice.primary.image} className="h-[40rem] object-cover xl:h-[45rem]" />
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col items-center justify-center bg-white bg-opacity-80 p-20 font-avenir tracking-widest xl:p-32">
        <h1 className="mb-8 text-center text-4xl font-semibold uppercase text-gray-900 md:text-5xl">
          {slice.primary.title_bold}
        </h1>
        <p className="mb-3 text-center text-3xl text-[#707070] first-letter:uppercase md:text-4xl">
          {slice.primary.subtitle_light}
        </p>
      </div>
    </section>
  );
};

export default BannerWithText;
