'use client';

import { type Content, isFilled } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { useEffect, useState } from 'react';

import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

export type CustomerLogosProps = SliceComponentProps<Content.CustomerLogosSlice>;

const CustomerLogos = ({ slice }: CustomerLogosProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slice.primary.logos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slice.primary.logos.length]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] p-6 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center">
          {slice.primary.title_light ? <SectionTitle text={slice.primary.title_light} /> : null}
          <SectionTitle text={slice.primary.title_bold} bold={true} />
          <Divider />
        </div>
        {slice.primary.logos.length > 0 && (
          <div className="mx-auto hidden w-full gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            {slice.primary.logos.map(
              (logo) =>
                isFilled.image(logo.image) && (
                  <div key={logo.image.url} className="flex h-full items-center justify-center">
                    <PrismicNextLink field={logo.link}>
                      <PrismicNextImage field={logo.image} height={26} width={160} />
                    </PrismicNextLink>
                  </div>
                )
            )}
          </div>
        )}
        <div className="grid w-full grid-cols-1 gap-8 md:hidden">
          <div>
            <PrismicNextImage
              className="mx-auto aspect-square w-3/4 object-contain sm:w-1/3"
              field={slice.primary.logos[currentIndex].image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerLogos;
