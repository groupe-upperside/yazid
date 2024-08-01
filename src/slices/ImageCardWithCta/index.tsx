'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import { useState } from 'react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';
import { getGridColsClass } from '@/utils/getGridColsClass';

/**
 * Props for `ImageCardWithCta`.
 */
export type ImageCardWithCtaProps = SliceComponentProps<Content.ImageCardWithCtaSlice>;

/**
 * Component for "ImageCardWithCta" Slices.
 */
const ImageCardWithCta = ({ slice }: ImageCardWithCtaProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = slice.primary.image_card;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] px-8 py-16 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="">
        <SectionTitle text={slice.primary.title_light} centered={true} />
        <SectionTitle text={slice.primary.title} bold={true} centered={true} />
        <Divider centered={true} />
        <div className={`hidden gap-8 md:grid md:grid-cols-2 ${getGridColsClass(slice.primary.number_per_row)}`}>
          {slice.primary.image_card.map((item, index) => (
            <div className="flex w-full flex-col bg-white" key={index}>
              <PrismicNextImage field={item.image} className="h-60 w-full object-cover" />
              <div className="flex flex-1 flex-col justify-between gap-y-3 px-8 py-12">
                <h5 className="pt-2 text-center text-xl font-bold uppercase tracking-widest text-gray-900">
                  {item.title}
                </h5>
                <p className="text-center text-lg font-bold uppercase tracking-widest text-[#9A9A9A]">
                  {item.location}
                </p>
                <div className="space-y-1 pb-2">
                  <PrismicRichText
                    field={item.description}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-center font-light tracking-widest text-[#9A9A9A]">{children}</p>
                      ),
                    }}
                  />
                </div>
                <Button link={item.link} label={item.link_label} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center space-x-4 md:hidden">
          <button
            type="button"
            onClick={goToPrevious}
            className="group h-fit cursor-pointer rounded-full bg-black p-1.5 focus:outline-none"
            data-carousel-prev
          >
            <span className="text-white hover:text-gray-900 group-focus:text-gray-900 dark:hover:text-white dark:group-focus:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="mi-solid mi-chevron-left"
                viewBox="0 0 24 24"
              >
                <path d="M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41" />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <div className={`block w-full lg:hidden`}>
            {slice.primary.image_card.map((item, index) => (
              <div
                key={index}
                className={`shrink-0 transition-transform duration-700 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
              >
                <div className="flex w-full flex-col bg-white">
                  <PrismicNextImage field={item.image} className="h-60 w-full object-cover" />
                  <div className="flex flex-1 flex-col justify-between gap-y-3 px-6 py-12">
                    <h5 className="pt-2 text-center text-lg font-bold uppercase tracking-widest text-gray-900 md:text-xl">
                      {item.title}
                    </h5>
                    <p className="pt-2 text-center text-base font-bold uppercase tracking-widest text-[#9A9A9A] md:text-lg">
                      {item.location}
                    </p>
                    <div className="space-y-1 pb-2">
                      <PrismicRichText
                        field={item.description}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="text-center text-sm tracking-widest text-[#9A9A9A] md:text-base">
                              {children}
                            </p>
                          ),
                        }}
                      />
                    </div>
                    <Button link={item.link} label={item.link_label} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={goToNext}
            className="group cursor-pointer rounded-full bg-black p-1.5 focus:outline-none"
            data-carousel-next
          >
            <span className="text-white hover:text-gray-900 group-focus:text-gray-900 dark:hover:text-white dark:group-focus:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="mi-solid mi-chevron-right"
                viewBox="0 0 24 24"
              >
                <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01" />
              </svg>

              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageCardWithCta;
