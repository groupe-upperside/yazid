import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import { getGridColsClass } from '@/utils/getGridColsClass';

/**
 * Props for `ImageGrid`.
 */
export type ImageGridProps = SliceComponentProps<Content.ImageGridSlice>;

const DefaultImageGrid = ({ slice }: ImageGridProps): JSX.Element => {
  return (
    <>
      <div className="grid">
        <h2 className="mb-3 text-center text-2xl font-semibold uppercase text-gray-900 md:text-3xl">
          {slice.primary.title}
        </h2>
        <Divider centered={true} />
        <div
          className={`lg:grid-cols- hidden gap-8 md:grid-cols-3 lg:grid${slice.primary.number_per_row - 1} ${getGridColsClass(slice.primary.number_per_row)}`}
        >
          {slice.primary.images.map((item) => (
            <div>
              <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 md:hidden">
          {slice.primary.images.slice(0, 1).map((item) => (
            <div>
              <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
            </div>
          ))}
        </div>
      </div>
      <Button link={slice.primary.link} label={slice.primary.link_label} />
    </>
  );
};

const OnlyImagesGrid = ({ slice }: ImageGridProps): JSX.Element => {
  return (
    <div
      className={`lg:grid-cols- grid gap-8 md:grid-cols-3${slice.primary.number_per_row - 1} ${slice.variation === 'imagesOnlyBgWhite' ? 'bg-white' : 'bg-[#F7F4EF]'} ${getGridColsClass(slice.primary.number_per_row)}`}
    >
      {slice.primary.images.map((item) => (
        <div>
          <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
        </div>
      ))}
    </div>
  );
};

/**
 * Component for "ImageGrid" Slices.
 */
const ImageGrid = ({ slice }: ImageGridProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`${slice.variation === 'imagesOnlyBgWhite' || slice.variation === 'default' ? 'bg-white' : 'bg-[#F7F4EF]'} p-20 font-avenir tracking-widest xl:p-32`}
    >
      {slice.variation === 'default' ? <DefaultImageGrid slice={slice} /> : <OnlyImagesGrid slice={slice} />}
    </section>
  );
};

export default ImageGrid;
