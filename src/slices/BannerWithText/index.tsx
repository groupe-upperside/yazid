import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { SliceComponentProps } from '@prismicio/react';

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
          <PrismicNextImage field={slice.primary.image} className="xl:h-[45rem] h-[40rem] object-cover" />
        </div>
      )}
      <div className="relative z-10 p-20 xl:p-32 flex flex-col items-center justify-center h-full font-avenir tracking-widest bg-white bg-opacity-80">
        <h1 className="mb-8 text-4xl font-semibold uppercase text-center text-gray-900 md:text-5xl">
          {slice.primary.title_bold}
        </h1>
        <p className="mb-3 text-3xl text-center text-[#707070] md:text-4xl first-letter:uppercase">
          {slice.primary.subtitle_light}
        </p>
      </div>
    </section>
  );
};

export default BannerWithText;
