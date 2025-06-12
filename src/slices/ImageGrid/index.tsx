'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { useEffect, useMemo, useState } from 'react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';
import { getGridColsClass } from '@/utils/getGridColsClass';

/**
 * Props for `ImageGrid`.
 */
export type ImageGridProps = SliceComponentProps<Content.ImageGridSlice>;

const ImageGridComponent = ({ slice }: { slice: Content.ImageGridSlice; variation: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = slice.primary.images || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const gridColsClass = useMemo(() => getGridColsClass(slice.primary.number_per_row), [slice.primary.number_per_row]);
  const lgGridCols = slice.primary.number_per_row
    ? `lg:grid-cols-${slice.primary.number_per_row - 1}`
    : 'lg:grid-cols-4';

  return (
    <>
      <div
        className={`${slice.primary.slider_on_small_screen ? 'hidden lg:grid' : 'grid grid-cols-1'} gap-8 ${lgGridCols} ${gridColsClass}`}
      >
        {images.map((item, index) => (
          <div key={index}>
            <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
          </div>
        ))}
      </div>
      {slice.primary.slider_on_small_screen && (
        <div className={`grid grid-cols-1 gap-8 lg:hidden`}>
          <div>
            <PrismicNextImage className="aspect-square w-full object-cover" field={images[currentIndex].image} />
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Component for "ImageGrid" Slices.
 */
const ImageGrid = ({ slice }: ImageGridProps): JSX.Element => {
  const { variation, primary } = slice;
  const sectionBgClass = variation === 'imagesOnlyBgWhite' || variation === 'default' ? 'bg-white' : 'bg-[#F7F4EF]';

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={variation}
      className={`${sectionBgClass} p-6 font-avenir tracking-widest md:p-20 xl:p-32`}
    >
      {variation === 'default' && (
        <>
          {primary.title_light && <SectionTitle text={primary.title_light} centered={true} />}
          {primary.title && <SectionTitle text={primary.title} bold={true} centered={true} />}
          <Divider centered={true} />
        </>
      )}
      {primary.images && <ImageGridComponent slice={slice} variation={variation} />}
      {variation === 'default' && primary.link && primary.link_label && (
        <Button link={primary.link} label={primary.link_label} />
      )}
    </section>
  );
};

export default ImageGrid;
