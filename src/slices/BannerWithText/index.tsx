import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Divider from '@/components/Divider';

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
      className="relative h-[45rem] md:h-[40rem] xl:h-[45rem]"
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <PrismicNextImage field={slice.primary.image} className="h-[40rem] object-cover xl:h-[45rem]" />
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col items-center justify-center bg-white bg-opacity-80 p-20 font-avenir tracking-widest xl:p-32">
        <h1 className="mb-8 text-center text-5xl font-medium uppercase text-gray-900 md:text-6xl">
          {slice.primary.title_bold}
        </h1>
        <p className="mb-3 text-center text-4xl text-[#707070] first-letter:uppercase md:text-5xl">
          {slice.primary.subtitle_light}
        </p>
        {isFilled.richText(slice.primary.description) ? (
          <>
            <Divider />
            <div className="space-y-6">
              <PrismicRichText
                field={slice.primary.description}
                components={{
                  paragraph: ({ children }) => <p className="text-center tracking-widest text-[#707070]">{children}</p>,
                  list: ({ children }) => (
                    <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                  ),
                }}
              />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default BannerWithText;
