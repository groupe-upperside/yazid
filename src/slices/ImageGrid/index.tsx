'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';
import { getGridColsClass } from '@/utils/getGridColsClass';

/**
 * Props for `ImageGrid`.
 */
export type ImageGridProps = SliceComponentProps<Content.ImageGridSlice>;

const DefaultImageGrid = ({ slice }: ImageGridProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slice.primary.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slice.primary.images.length]);

  return (
    <>
      <div className="grid">
        <SectionTitle text={slice.primary.title_light} centered={true} />
        <SectionTitle text={slice.primary.title} bold={true} centered={true} />
        <Divider centered={true} />
        <div
          className={`lg:grid-cols-${slice.primary.number_per_row - 1} hidden gap-8 md:grid md:grid-cols-3 ${getGridColsClass(slice.primary.number_per_row)}`}
        >
          {slice.primary.images.map((item, index) => (
            <div key={index}>
              <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 md:hidden">
          <div>
            <PrismicNextImage
              className="aspect-square w-full object-cover"
              field={slice.primary.images[currentIndex].image}
            />
          </div>
        </div>
      </div>
      <Button link={slice.primary.link} label={slice.primary.link_label} />
    </>
  );
};

const OnlyImagesGrid = ({ slice }: ImageGridProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slice.primary.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slice.primary.images.length]);

  return (
    <>
      <div
        className={`lg:grid-cols-${slice.primary.number_per_row - 1} hidden gap-8 md:grid md:grid-cols-3 ${slice.variation === 'imagesOnlyBgWhite' ? 'bg-white' : 'bg-[#F7F4EF]'} ${getGridColsClass(slice.primary.number_per_row)}`}
      >
        {slice.primary.images.map((item, index) => (
          <div key={index}>
            <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 md:hidden">
        <div>
          <PrismicNextImage
            className="aspect-square w-full object-cover"
            field={slice.primary.images[currentIndex].image}
          />
        </div>
      </div>
    </>
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
      className={`${slice.variation === 'imagesOnlyBgWhite' || slice.variation === 'default' ? 'bg-white' : 'bg-[#F7F4EF]'} p-12 font-avenir tracking-widest md:p-20 xl:p-32`}
    >
      {slice.variation === 'default' ? <DefaultImageGrid slice={slice} /> : <OnlyImagesGrid slice={slice} />}
    </section>
  );
};

export default ImageGrid;
