'use client';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import { getGridColsClass } from '@/utils/getGridColsClass';
import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { useState } from 'react';

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
      className="bg-[#F7F4EF] p-20 xl:p-32 font-avenir tracking-widest"
    >
      <div className="">
        <h2 className="mb-3 text-2xl font-semibold uppercase text-gray-900 md:text-3xl text-center">
          {slice.primary.title}
        </h2>
        <Divider centered={true} />
        <div className={`hidden lg:grid gap-8 lg:grid-cols-2 ${getGridColsClass(slice.primary.number_per_row)}`}>
          {slice.primary.image_card.map((item) => (
            <div className="w-full bg-white flex flex-col">
              <PrismicNextImage field={item.image} className="w-full h-60 object-cover" />
              <div className="px-8 py-12 flex-1 flex flex-col justify-between gap-y-3">
                <h5 className="text-xl pt-2 uppercase text-center font-bold tracking-widest text-gray-900">
                  {item.title}
                </h5>
                <p className="text-center text-lg uppercase font-bold tracking-widest text-[#9A9A9A]">
                  {item.location}
                </p>
                <div className="space-y-1 pb-2">
                  <PrismicRichText
                    field={item.description}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-center tracking-widest text-[#9A9A9A]">{children}</p>
                      ),
                    }}
                  />
                </div>
                <Button link={item.link} label={item.link_label} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex lg:hidden flex-row items-center justify-center space-x-8">
          <button
            type="button"
            onClick={goToPrevious}
            className="bg-black rounded-full h-fit p-1.5 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="text-white hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
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
                className={`flex-shrink-0 transition-transform duration-700 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
              >
                <div className="w-full bg-white flex flex-col">
                  <PrismicNextImage field={item.image} className="w-full h-60 object-cover" />
                  <div className="px-8 py-12 flex-1 flex flex-col justify-between gap-y-3">
                    <h5 className="text-xl pt-2 uppercase text-center font-bold tracking-widest text-gray-900">
                      {item.title}
                    </h5>
                    <p className="text-center text-lg uppercase font-bold tracking-widest text-[#9A9A9A]">
                      {item.location}
                    </p>
                    <div className="space-y-1 pb-2">
                      <PrismicRichText
                        field={item.description}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="text-center tracking-widest text-[#9A9A9A]">{children}</p>
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
            className="bg-black rounded-full p-1.5 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="text-white hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
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
